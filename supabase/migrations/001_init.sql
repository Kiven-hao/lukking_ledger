CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE public.ledger_role AS ENUM ('owner', 'editor', 'viewer');
CREATE TYPE public.invite_status AS ENUM ('active', 'used', 'expired');
CREATE TYPE public.category_type AS ENUM ('expense', 'income', 'transfer');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nickname)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'nickname', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.ledgers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'book',
  currency TEXT NOT NULL DEFAULT 'CNY',
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_ledgers_updated_at
BEFORE UPDATE ON public.ledgers
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.ledger_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ledger_id UUID NOT NULL REFERENCES public.ledgers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.ledger_role NOT NULL DEFAULT 'editor',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (ledger_id, user_id)
);

CREATE TABLE public.ledger_invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ledger_id UUID NOT NULL REFERENCES public.ledgers(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  role public.ledger_role NOT NULL DEFAULT 'editor',
  created_by UUID NOT NULL REFERENCES auth.users(id),
  status public.invite_status NOT NULL DEFAULT 'active',
  expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '7 days',
  used_by UUID REFERENCES auth.users(id),
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ledger_id UUID NOT NULL REFERENCES public.ledgers(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  type public.category_type NOT NULL DEFAULT 'expense',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_system BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_categories_ledger ON public.categories (ledger_id);
CREATE INDEX idx_categories_parent ON public.categories (parent_id);

CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ledger_id UUID NOT NULL REFERENCES public.ledgers(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  amount NUMERIC(15, 2) NOT NULL,
  type public.category_type NOT NULL,
  note TEXT,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transactions_ledger ON public.transactions (ledger_id);
CREATE INDEX idx_transactions_occurred ON public.transactions (occurred_at DESC, id DESC);
CREATE INDEX idx_transactions_category ON public.transactions (category_id);
CREATE INDEX idx_transactions_created_by ON public.transactions (created_by);

CREATE TRIGGER trg_transactions_updated_at
BEFORE UPDATE ON public.transactions
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ledgers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ledger_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ledger_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_ledger_member(p_ledger_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.ledger_members
    WHERE ledger_id = p_ledger_id AND user_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_ledger_editor(p_ledger_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.ledger_members
    WHERE ledger_id = p_ledger_id
      AND user_id = auth.uid()
      AND role IN ('owner', 'editor')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE POLICY "profiles_self_access"
ON public.profiles FOR ALL
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

CREATE POLICY "ledgers_select_member"
ON public.ledgers FOR SELECT
USING (public.is_ledger_member(id));

CREATE POLICY "ledgers_insert_authenticated"
ON public.ledgers FOR INSERT
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "ledgers_update_owner"
ON public.ledgers FOR UPDATE
USING (owner_id = auth.uid());

CREATE POLICY "ledgers_delete_owner"
ON public.ledgers FOR DELETE
USING (owner_id = auth.uid());

CREATE POLICY "ledger_members_select_member"
ON public.ledger_members FOR SELECT
USING (public.is_ledger_member(ledger_id));

CREATE POLICY "ledger_members_owner_manage"
ON public.ledger_members FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.ledgers
    WHERE id = ledger_id AND owner_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.ledgers
    WHERE id = ledger_id AND owner_id = auth.uid()
  )
);

CREATE POLICY "ledger_invites_select_member"
ON public.ledger_invites FOR SELECT
USING (public.is_ledger_member(ledger_id));

CREATE POLICY "ledger_invites_editor_insert"
ON public.ledger_invites FOR INSERT
WITH CHECK (public.is_ledger_editor(ledger_id));

CREATE POLICY "ledger_invites_editor_update"
ON public.ledger_invites FOR UPDATE
USING (public.is_ledger_editor(ledger_id));

CREATE POLICY "categories_select_member"
ON public.categories FOR SELECT
USING (public.is_ledger_member(ledger_id));

CREATE POLICY "categories_insert_editor"
ON public.categories FOR INSERT
WITH CHECK (public.is_ledger_editor(ledger_id));

CREATE POLICY "categories_update_editor"
ON public.categories FOR UPDATE
USING (public.is_ledger_editor(ledger_id));

CREATE POLICY "categories_delete_editor"
ON public.categories FOR DELETE
USING (public.is_ledger_editor(ledger_id));

CREATE POLICY "transactions_select_member"
ON public.transactions FOR SELECT
USING (public.is_ledger_member(ledger_id));

CREATE POLICY "transactions_insert_editor"
ON public.transactions FOR INSERT
WITH CHECK (public.is_ledger_editor(ledger_id));

CREATE POLICY "transactions_update_creator_or_editor"
ON public.transactions FOR UPDATE
USING (created_by = auth.uid() OR public.is_ledger_editor(ledger_id));

CREATE POLICY "transactions_delete_creator_or_owner"
ON public.transactions FOR DELETE
USING (
  created_by = auth.uid()
  OR EXISTS (
    SELECT 1
    FROM public.ledgers
    WHERE id = ledger_id AND owner_id = auth.uid()
  )
);

CREATE VIEW public.monthly_summary AS
SELECT
  t.ledger_id,
  DATE_TRUNC('month', t.occurred_at) AS month,
  t.type,
  c.id AS category_id,
  c.name AS category_name,
  c.parent_id,
  COUNT(*) AS tx_count,
  COALESCE(SUM(t.amount), 0)::NUMERIC(15, 2) AS total_amount
FROM public.transactions t
LEFT JOIN public.categories c ON t.category_id = c.id
GROUP BY t.ledger_id, month, t.type, c.id, c.name, c.parent_id;

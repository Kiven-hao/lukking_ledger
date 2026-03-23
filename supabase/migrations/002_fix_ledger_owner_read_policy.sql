DROP POLICY IF EXISTS "ledgers_select_member" ON public.ledgers;

CREATE POLICY "ledgers_select_owner_or_member"
ON public.ledgers FOR SELECT
USING (
  owner_id = auth.uid()
  OR public.is_ledger_member(id)
);

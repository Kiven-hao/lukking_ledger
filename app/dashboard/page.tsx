import { createSupabaseServer } from "@/lib/supabase/server";
import { CreateLedgerForm } from "@/components/ledger/create-ledger-form";
import { LedgerCard } from "@/components/ledger/ledger-card";

export default async function DashboardPage() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: memberships } = user
    ? await supabase
        .from("ledger_members")
        .select("role, ledger:ledgers(id, name, description, icon, currency, owner_id)")
        .eq("user_id", user.id)
        .order("joined_at", { ascending: false })
    : { data: [] };

  const ownerIds = (memberships ?? [])
    .map((item) => {
      const ledger = (item as { ledger: { owner_id?: string } | Array<{ owner_id?: string }> | null }).ledger;
      return Array.isArray(ledger) ? ledger[0]?.owner_id : ledger?.owner_id;
    })
    .filter(Boolean);

  const { data: owners } = ownerIds.length
    ? await supabase.from("profiles").select("id, nickname").in("id", ownerIds)
    : { data: [] };

  const ownerNameMap = new Map((owners ?? []).map((owner) => [owner.id, owner.nickname]));

  return (
    <div className="grid">
      <section className="panel" style={{ padding: 28 }}>
        <h1 style={{ marginTop: 0 }}>账本控制台</h1>
        <p style={{ color: "var(--muted-foreground)", lineHeight: 1.7 }}>
          这里展示当前用户可访问的全部账本，并支持直接新建一个账本。
        </p>
        <CreateLedgerForm />
      </section>

      <section className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        {(memberships ?? []).map((membership, index) => {
          const ledgerRelation = (membership as {
            role: string;
            ledger: {
              id: string;
              name: string;
              description: string | null;
              icon: string | null;
              currency: string;
              owner_id: string;
            } | Array<{
              id: string;
              name: string;
              description: string | null;
              icon: string | null;
              currency: string;
              owner_id: string;
            }> | null;
          }).ledger;
          const ledger = Array.isArray(ledgerRelation) ? ledgerRelation[0] : ledgerRelation;
          if (!ledger) return null;

          return (
            <LedgerCard
              key={ledger.id ?? index}
              id={ledger.id}
              name={ledger.name}
              description={ledger.description}
              icon={ledger.icon}
              currency={ledger.currency}
              role={membership.role}
              ownerName={ownerNameMap.get(ledger.owner_id) ?? null}
            />
          );
        })}
      </section>
    </div>
  );
}

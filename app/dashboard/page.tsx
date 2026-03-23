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
      <section className="panel glass-panel page-header fade-up">
        <span className="section-kicker">Ledger Overview</span>
        <div className="page-header-top">
          <div style={{ maxWidth: 700 }}>
            <h1 className="page-title">账本控制台</h1>
            <p className="body-copy" style={{ margin: 0, fontSize: 17 }}>
              这里展示当前用户可访问的全部账本。新建账本、切换视角和进入明细都应该像翻阅同一册账簿那样自然。
            </p>
          </div>
          <div className="metric-card" style={{ minWidth: 220 }}>
            <p style={{ margin: 0, color: "var(--muted-foreground)" }}>可访问账本</p>
            <strong>{memberships?.length ?? 0}</strong>
            <p style={{ margin: 0 }} className="body-copy">你当前有权限进入的账本总数。</p>
          </div>
        </div>
      </section>

      <section className="split-panel fade-up stagger-1">
        <div className="panel glass-panel" style={{ padding: 28 }}>
          <span className="section-kicker">Create Ledger</span>
          <h2 style={{ margin: "18px 0 10px", fontSize: 34 }}>新建账本</h2>
          <p className="body-copy" style={{ marginTop: 0 }}>
            为家庭、旅行、宠物、工作室或共同储蓄建立一个专属账本。
          </p>
          <CreateLedgerForm />
        </div>
        <div className="panel glass-panel" style={{ padding: 28, display: "grid", alignContent: "start", gap: 14 }}>
          <span className="section-kicker">Snapshot</span>
          <h2 style={{ margin: "8px 0 0", fontSize: 34 }}>本周节奏</h2>
          <p className="body-copy" style={{ marginTop: 0 }}>
            把每个账本当作独立空间：有成员关系、有记账习惯，也有各自的预算语境。
          </p>
          <div className="stats-grid">
            <article className="stat-card">
              <p style={{ margin: 0, color: "var(--muted-foreground)" }}>账本数量</p>
              <strong>{memberships?.length ?? 0}</strong>
            </article>
            <article className="stat-card">
              <p style={{ margin: 0, color: "var(--muted-foreground)" }}>主理角色</p>
              <strong>{(memberships ?? []).filter((item) => item.role === "owner").length}</strong>
            </article>
          </div>
        </div>
      </section>

      <section className="ledger-grid fade-up stagger-2">
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

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

  const ledgerCount = memberships?.length ?? 0;
  const ownerRoleCount = (memberships ?? []).filter((item) => item.role === "owner").length;

  return (
    <div className="grid">
      {/* ── Header: Ledger Overview ── */}
      <section className="panel glass-panel page-header fade-up">
        <span className="section-kicker">Ledger Overview</span>
        <div className="page-header-top">
          <div style={{ maxWidth: 700 }}>
            <h1 className="page-title">账本控制台</h1>
            <p className="body-copy" style={{ margin: 0, fontSize: 17, lineHeight: 1.9 }}>
              万卷帐册，一室可阅。此间陈列你所触及的每一本账簿——新建、切换、深入明细，皆如展卷阅读般从容。
            </p>
          </div>
          <div className="metric-card" style={{ minWidth: 220 }}>
            <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 13, letterSpacing: "0.04em" }}>
              可访问账本
            </p>
            <strong>{ledgerCount}</strong>
            <p className="body-copy" style={{ margin: 0, fontSize: 13 }}>
              你当前有权翻阅的账簿总数。
            </p>
          </div>
        </div>
      </section>

      {/* ── Split Panel: Create + Snapshot ── */}
      <section className="split-panel fade-up stagger-1">
        {/* Left: Create Ledger */}
        <div className="panel glass-panel" style={{ padding: 28 }}>
          <span className="section-kicker">Create Ledger</span>
          <h2 style={{ margin: "18px 0 10px", fontSize: 34, fontWeight: 600, letterSpacing: "-0.02em" }}>
            新建账本
          </h2>
          <p className="body-copy" style={{ marginTop: 0, marginBottom: 20 }}>
            为家庭晨昏、远行旅途、工作室项目或共同积蓄，开辟一册专属账簿。
          </p>
          <div className="soft-divider" style={{ marginBottom: 20 }} />
          <CreateLedgerForm />
        </div>

        {/* Right: Weekly Snapshot + Stats */}
        <div className="panel glass-panel" style={{ padding: 28, display: "grid", alignContent: "start", gap: 14 }}>
          <span className="section-kicker">Snapshot</span>
          <h2 style={{ margin: "8px 0 0", fontSize: 34, fontWeight: 600, letterSpacing: "-0.02em" }}>
            本周节奏
          </h2>
          <p className="body-copy" style={{ marginTop: 0 }}>
            每本账簿皆是独立天地——有成员往来、有记账脉络，亦有各自的预算语境。静观其变，方知全局。
          </p>
          <div className="soft-divider" />
          <div className="stats-grid">
            <article className="stat-card">
              <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 13, letterSpacing: "0.03em" }}>
                账本数量
              </p>
              <strong>{ledgerCount}</strong>
            </article>
            <article className="stat-card">
              <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 13, letterSpacing: "0.03em" }}>
                主理角色
              </p>
              <strong>{ownerRoleCount}</strong>
            </article>
          </div>
          <p className="body-copy" style={{ margin: 0, fontSize: 13 }}>
            {ownerRoleCount > 0
              ? `你主理着 ${ownerRoleCount} 本账簿，身兼掌簿之责。`
              : "尚无主理之责，可新建账簿以开篇。"}
          </p>
        </div>
      </section>

      {/* ── Ledger Grid ── */}
      <section className="fade-up stagger-2" style={{ display: "grid", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span className="section-kicker">All Ledgers</span>
          <p className="body-copy" style={{ margin: 0, fontSize: 13 }}>
            共 {ledgerCount} 册
          </p>
        </div>
        <div className="ledger-grid">
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
        </div>
      </section>

      {/* ── Rhythm / Summary Footer ── */}
      <section className="panel glass-panel fade-up stagger-3" style={{ padding: 28 }}>
        <span className="section-kicker">Cadence</span>
        <h2 style={{ margin: "18px 0 10px", fontSize: 34, fontWeight: 600, letterSpacing: "-0.02em" }}>
          记账如落笔
        </h2>
        <p className="body-copy" style={{ marginTop: 0, maxWidth: 620 }}>
          一笔一划间，收支自有纹理。保持节奏，账簿便不再是负担，而是对生活的一种注释。
        </p>
        <div className="soft-divider" style={{ margin: "12px 0" }} />
        <div className="stats-grid">
          <article className="stat-card">
            <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 13 }}>已有账簿</p>
            <strong>{ledgerCount}</strong>
          </article>
          <article className="stat-card">
            <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 13 }}>受邀协作</p>
            <strong>{ledgerCount - ownerRoleCount}</strong>
          </article>
          <article className="stat-card">
            <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 13 }}>主理占比</p>
            <strong>
              {ledgerCount > 0 ? `${Math.round((ownerRoleCount / ledgerCount) * 100)}%` : "—"}
            </strong>
          </article>
        </div>
      </section>
    </div>
  );
}

interface LedgerAnalyticsPageProps {
  params: Promise<{ id: string }>;
}

export default async function LedgerAnalyticsPage({ params }: LedgerAnalyticsPageProps) {
  const { id } = await params;

  return (
    <div className="grid">
      {/* ── Page Header ── */}
      <section className="panel glass-panel page-header fade-up">
        <span className="section-kicker">Ledger Analytics</span>
        <div className="page-header-top">
          <div style={{ maxWidth: 700 }}>
            <h1 className="page-title">账本分析</h1>
            <p className="body-copy" style={{ margin: 0, fontSize: 17 }}>
              聚焦账本 <code>{id}</code> 的财务脉络——
              从月度波动到分类结构，将每一笔流水转化为清晰的洞见。
            </p>
          </div>
          <div className="badge">预览模式</div>
        </div>
      </section>

      {/* ── Feature Preview Cards ── */}
      <section className="stats-grid fade-up stagger-1">
        <article className="stat-card" style={{ display: "grid", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                width: 32,
                height: 32,
                borderRadius: "var(--r-full)",
                background: "var(--income-bg)",
                border: "1px solid rgba(94,189,138,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 15,
              }}
            >
              ⟋
            </span>
            <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 13 }}>即将上线</p>
          </div>
          <strong style={{ fontSize: 22, color: "var(--income)" }}>月度收支</strong>
          <p className="body-copy" style={{ margin: 0, fontSize: 13 }}>
            逐月追踪这本账的收入与支出，发现规律性的节奏变化。
          </p>
        </article>

        <article className="stat-card" style={{ display: "grid", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                width: 32,
                height: 32,
                borderRadius: "var(--r-full)",
                background: "var(--expense-bg)",
                border: "1px solid rgba(224,124,90,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 15,
              }}
            >
              ◉
            </span>
            <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 13 }}>即将上线</p>
          </div>
          <strong style={{ fontSize: 22, color: "var(--expense)" }}>分类饼图</strong>
          <p className="body-copy" style={{ margin: 0, fontSize: 13 }}>
            以环形图呈现支出分布，一眼看清钱都花在了哪里。
          </p>
        </article>

        <article className="stat-card" style={{ display: "grid", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                width: 32,
                height: 32,
                borderRadius: "var(--r-full)",
                background: "var(--transfer-bg)",
                border: "1px solid rgba(123,156,219,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 15,
              }}
            >
              ⤻
            </span>
            <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 13 }}>即将上线</p>
          </div>
          <strong style={{ fontSize: 22, color: "var(--transfer)" }}>趋势折线</strong>
          <p className="body-copy" style={{ margin: 0, fontSize: 13 }}>
            时间序列上的流水走势，标注拐点与峰谷。
          </p>
        </article>

        <article className="stat-card" style={{ display: "grid", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                width: 32,
                height: 32,
                borderRadius: "var(--r-full)",
                background: "var(--gold-glow)",
                border: "1px solid rgba(201,169,110,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 15,
              }}
            >
              ⊕
            </span>
            <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 13 }}>即将上线</p>
          </div>
          <strong style={{ fontSize: 22, color: "var(--gold)" }}>成员贡献</strong>
          <p className="body-copy" style={{ margin: 0, fontSize: 13 }}>
            谁记账最勤、谁贡献最多——协作透明，从数据开始。
          </p>
        </article>
      </section>

      {/* ── Sample Visualization ── */}
      <section className="analytics-grid fade-up stagger-2">
        <div className="chart-container" style={{ display: "grid", gap: 20 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, color: "var(--text-primary)" }}>
              收支结构预览
            </h3>
            <p className="body-copy" style={{ margin: "6px 0 0", fontSize: 13 }}>
              示意数据 · 真实图表接入后替换
            </p>
          </div>
          <div style={{ display: "grid", gap: 16 }}>
            {[
              { label: "Q1", income: 65, expense: 42, transfer: 18 },
              { label: "Q2", income: 82, expense: 55, transfer: 25 },
              { label: "Q3", income: 70, expense: 68, transfer: 12 },
              { label: "Q4", income: 95, expense: 50, transfer: 30 },
            ].map((quarter) => (
              <div key={quarter.label} style={{ display: "grid", gap: 6 }}>
                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                  {quarter.label}
                </span>
                <div style={{ display: "grid", gap: 4 }}>
                  <div
                    className="chart-bar chart-bar--income"
                    style={{ width: `${quarter.income}%` }}
                  />
                  <div
                    className="chart-bar chart-bar--expense"
                    style={{ width: `${quarter.expense}%` }}
                  />
                  <div
                    className="chart-bar chart-bar--transfer"
                    style={{ width: `${quarter.transfer}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              gap: 20,
              paddingTop: 8,
              borderTop: "1px solid var(--border-subtle)",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-tertiary)" }}>
              <span style={{ width: 12, height: 4, borderRadius: 2, background: "var(--income)" }} />
              收入
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-tertiary)" }}>
              <span style={{ width: 12, height: 4, borderRadius: 2, background: "var(--expense)" }} />
              支出
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-tertiary)" }}>
              <span style={{ width: 12, height: 4, borderRadius: 2, background: "var(--transfer)" }} />
              转账
            </span>
          </div>
        </div>

        <div className="chart-container" style={{ display: "grid", gap: 20 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, color: "var(--text-primary)" }}>
              成员活跃度预览
            </h3>
            <p className="body-copy" style={{ margin: "6px 0 0", fontSize: 13 }}>
              示意数据 · 展示成员记账频率
            </p>
          </div>
          <div style={{ display: "grid", gap: 14 }}>
            {[
              { name: "账本主理人", pct: 48, color: "var(--gold)" },
              { name: "成员 A", pct: 30, color: "var(--income)" },
              { name: "成员 B", pct: 15, color: "var(--transfer)" },
              { name: "成员 C", pct: 7, color: "var(--text-tertiary)" },
            ].map((member) => (
              <div key={member.name} style={{ display: "grid", gap: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: "var(--text-secondary)" }}>{member.name}</span>
                  <span style={{ color: "var(--text-tertiary)" }}>{member.pct}%</span>
                </div>
                <div
                  style={{
                    height: 6,
                    borderRadius: "var(--r-full)",
                    background: "var(--border-subtle)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${member.pct}%`,
                      height: "100%",
                      borderRadius: "var(--r-full)",
                      background: member.color,
                      opacity: 0.8,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── API Reference ── */}
      <section className="panel glass-panel fade-up stagger-3" style={{ padding: 28 }}>
        <div style={{ display: "grid", gap: 14 }}>
          <h3 style={{ margin: 0, fontSize: 18, color: "var(--text-primary)" }}>
            待接入接口
          </h3>
          <p className="body-copy" style={{ margin: 0 }}>
            以下 API 已就绪，待前端图表组件完成后即可与此账本的数据联动。
          </p>
          <div className="soft-divider" />
          <div style={{ display: "grid", gap: 10 }}>
            {[
              {
                api: "summary",
                desc: "账本级汇总——该账本内各类型交易的总额、笔数与均值",
              },
              {
                api: "category-pie",
                desc: "分类环形图——按 category 分组的金额占比与排行",
              },
              {
                api: "trend",
                desc: "时间趋势——按月/周粒度聚合的金额走势序列",
              },
            ].map((item) => (
              <div
                key={item.api}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 12,
                  padding: "10px 0",
                  borderBottom: "1px solid var(--border-subtle)",
                }}
              >
                <code style={{ flexShrink: 0 }}>{item.api}</code>
                <span className="body-copy" style={{ fontSize: 13 }}>
                  {item.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing Note ── */}
      <section className="fade-up stagger-4" style={{ textAlign: "center", padding: "20px 0 8px" }}>
        <p style={{ color: "var(--text-tertiary)", fontSize: 13, margin: 0, letterSpacing: "0.04em" }}>
          一本账，一方天地——数据尚在积累，洞察即将浮现
        </p>
      </section>
    </div>
  );
}

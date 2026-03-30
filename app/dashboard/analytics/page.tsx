export default function DashboardAnalyticsPage() {
  return (
    <div className="grid">
      {/* ── Page Header ── */}
      <section className="panel glass-panel page-header fade-up">
        <span className="section-kicker">Analytics Hub</span>
        <div className="page-header-top">
          <div style={{ maxWidth: 700 }}>
            <h1 className="page-title">分析概览</h1>
            <p className="body-copy" style={{ margin: 0, fontSize: 17 }}>
              全局数据洞察中心——跨越账本边界，将分散的流水汇聚为可读的趋势与结构。
              当数据足够丰富时，这里会呈现月度波动、分类权重与多账本对比视图。
            </p>
          </div>
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
                border: "1px solid rgba(34,197,94,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 15,
              }}
            >
              ⟋
            </span>
            <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 13 }}>即将推出</p>
          </div>
          <strong style={{ fontSize: 22, color: "var(--income)" }}>月度趋势</strong>
          <p className="body-copy" style={{ margin: 0, fontSize: 13 }}>
            追踪收支随时间的起伏节奏，识别周期性模式与异常波动。
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
                border: "1px solid rgba(244,63,94,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 15,
              }}
            >
              ◉
            </span>
            <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 13 }}>即将推出</p>
          </div>
          <strong style={{ fontSize: 22, color: "var(--expense)" }}>分类洞察</strong>
          <p className="body-copy" style={{ margin: 0, fontSize: 13 }}>
            饼图视角下的支出结构，让每一分钱的去向清晰可见。
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
                border: "1px solid rgba(59,130,246,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 15,
              }}
            >
              ⇄
            </span>
            <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 13 }}>即将推出</p>
          </div>
          <strong style={{ fontSize: 22, color: "var(--transfer)" }}>跨账本对比</strong>
          <p className="body-copy" style={{ margin: 0, fontSize: 13 }}>
            多账本并列审视，对比不同生活场景下的财务脉络。
          </p>
        </article>
      </section>

      {/* ── Sample Chart Visualization ── */}
      <section className="analytics-grid fade-up stagger-2">
        <div className="chart-container" style={{ display: "grid", gap: 20 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, color: "var(--text-primary)" }}>
              月度收支预览
            </h3>
            <p className="body-copy" style={{ margin: "6px 0 0", fontSize: 13 }}>
              示意图 · 接入真实数据后自动呈现
            </p>
          </div>
          <div style={{ display: "grid", gap: 14 }}>
            {[
              { label: "一月", income: 72, expense: 45 },
              { label: "二月", income: 58, expense: 62 },
              { label: "三月", income: 85, expense: 40 },
              { label: "四月", income: 64, expense: 53 },
              { label: "五月", income: 90, expense: 35 },
              { label: "六月", income: 78, expense: 48 },
            ].map((month) => (
              <div key={month.label} style={{ display: "grid", gap: 6 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 13, color: "var(--text-secondary)", minWidth: 36 }}>
                    {month.label}
                  </span>
                  <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>
                    示意数据
                  </span>
                </div>
                <div style={{ display: "grid", gap: 4 }}>
                  <div
                    className="chart-bar chart-bar--income"
                    style={{ width: `${month.income}%` }}
                  />
                  <div
                    className="chart-bar chart-bar--expense"
                    style={{ width: `${month.expense}%` }}
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
          </div>
        </div>

        <div className="chart-container" style={{ display: "grid", gap: 20 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, color: "var(--text-primary)" }}>
              分类占比预览
            </h3>
            <p className="body-copy" style={{ margin: "6px 0 0", fontSize: 13 }}>
              示意图 · 真实饼图即将上线
            </p>
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            {[
              { name: "餐饮", pct: 34, color: "var(--expense)" },
              { name: "交通", pct: 18, color: "var(--transfer)" },
              { name: "购物", pct: 24, color: "var(--gold)" },
              { name: "娱乐", pct: 12, color: "var(--income)" },
              { name: "其他", pct: 12, color: "var(--text-tertiary)" },
            ].map((cat) => (
              <div key={cat.name} style={{ display: "grid", gap: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: "var(--text-secondary)" }}>{cat.name}</span>
                  <span style={{ color: "var(--text-tertiary)" }}>{cat.pct}%</span>
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
                      width: `${cat.pct}%`,
                      height: "100%",
                      borderRadius: "var(--r-full)",
                      background: cat.color,
                      opacity: 0.8,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── API Reference Note ── */}
      <section className="panel glass-panel fade-up stagger-3" style={{ padding: 28 }}>
        <div style={{ display: "grid", gap: 14 }}>
          <h3 style={{ margin: 0, fontSize: 18, color: "var(--text-primary)" }}>
            可用数据接口
          </h3>
          <p className="body-copy" style={{ margin: 0 }}>
            当前版本已预备三组分析 API，待图表组件接入后即可驱动上方视图。
          </p>
          <div className="soft-divider" />
          <div style={{ display: "grid", gap: 10 }}>
            {[
              {
                api: "summary",
                desc: "汇总统计——收入、支出、转账的总额与笔数",
              },
              {
                api: "category-pie",
                desc: "分类饼图数据——按交易类型分组的金额占比",
              },
              {
                api: "trend",
                desc: "趋势折线数据——按月或按周聚合的时间序列",
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

      {/* ── Elegant Coming Soon Note ── */}
      <section className="fade-up stagger-4" style={{ textAlign: "center", padding: "20px 0 8px" }}>
        <p style={{ color: "var(--text-tertiary)", fontSize: 13, margin: 0, letterSpacing: "0.04em" }}>
          数据如墨，待笔落时自成篇章
        </p>
      </section>
    </div>
  );
}

export default function DashboardAnalyticsPage() {
  return (
    <section className="panel" style={{ padding: 28 }}>
      <h1 style={{ marginTop: 0 }}>分析概览</h1>
      <p style={{ color: "var(--muted-foreground)", lineHeight: 1.7 }}>
        预留汇总图表页面。当前版本已提供 summary、category-pie、trend 三个 API，可直接在此接图表组件。
      </p>
    </section>
  );
}

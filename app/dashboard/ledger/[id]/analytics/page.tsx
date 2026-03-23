interface LedgerAnalyticsPageProps {
  params: Promise<{ id: string }>;
}

export default async function LedgerAnalyticsPage({ params }: LedgerAnalyticsPageProps) {
  const { id } = await params;

  return (
    <section className="panel" style={{ padding: 28 }}>
      <h1 style={{ marginTop: 0 }}>账本分析</h1>
      <p style={{ color: "var(--muted-foreground)", lineHeight: 1.7 }}>
        账本 <code>{id}</code> 的图表与分析视图可在这里扩展。
      </p>
    </section>
  );
}

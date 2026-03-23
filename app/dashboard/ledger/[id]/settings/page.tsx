interface LedgerSettingsPageProps {
  params: Promise<{ id: string }>;
}

export default async function LedgerSettingsPage({ params }: LedgerSettingsPageProps) {
  const { id } = await params;

  return (
    <section className="panel" style={{ padding: 28 }}>
      <h1 style={{ marginTop: 0 }}>账本设置</h1>
      <p style={{ color: "var(--muted-foreground)", lineHeight: 1.7 }}>
        这里可以接账本基础信息、成员管理与邀请配置。当前账本 ID 为 <code>{id}</code>。
      </p>
    </section>
  );
}

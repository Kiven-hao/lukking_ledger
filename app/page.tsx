import Link from "next/link";

export default function HomePage() {
  return (
    <main className="shell">
      <div className="container grid">
        <section className="panel" style={{ padding: 32 }}>
          <span className="badge">多人协作记账 · Next.js 15 · Supabase</span>
          <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", margin: "20px 0 12px" }}>Lukking Ledger</h1>
          <p style={{ maxWidth: 680, lineHeight: 1.7, color: "var(--muted-foreground)", margin: 0 }}>
            一个面向家庭、情侣和小团队的协作式账本。当前版本已搭好核心 API、数据库迁移和基础控制台页面，可直接接入 Supabase
            继续联调。
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
            <Link href="/login" className="panel" style={{ padding: "14px 18px", background: "var(--accent)", color: "var(--accent-foreground)" }}>
              前往登录
            </Link>
            <Link href="/dashboard" className="panel" style={{ padding: "14px 18px" }}>
              查看控制台
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="shell">
      <div className="container grid">
        <section className="panel glass-panel page-header fade-up">
          <span className="section-kicker">Collaborative Ledger Studio</span>
          <div className="page-header-top">
            <div style={{ maxWidth: 760 }}>
              <h1 className="hero-title">把家庭、情侣和小团队的财务协作，做得像一本精心编排的账簿。</h1>
              <p className="hero-copy" style={{ margin: 0, fontSize: 18 }}>
                Lukking Ledger 将账本、成员、分类、交易与分析放进同一条流畅体验里。它不只是记账工具，更像一块带秩序感的共享桌面。
              </p>
            </div>
            <div className="metric-card" style={{ minWidth: 220 }}>
              <p style={{ margin: 0, color: "var(--muted-foreground)" }}>当前能力</p>
              <strong>Web MVP</strong>
              <p style={{ margin: 0 }} className="body-copy">登录注册、多人账本、交易录入、筛选分析接口已经成型。</p>
            </div>
          </div>
          <div className="button-row">
            <Link href="/login" className="button-primary">
              进入账本
            </Link>
            <Link href="/register" className="button-secondary">
              创建账号
            </Link>
            <Link href="/dashboard" className="button-ghost">
              直接预览控制台
            </Link>
          </div>
        </section>

        <section className="stats-grid fade-up stagger-1">
          <article className="stat-card">
            <p style={{ margin: 0, color: "var(--muted-foreground)" }}>协作模式</p>
            <strong>3 级</strong>
            <p style={{ margin: 0 }} className="body-copy">owner / editor / viewer 权限分层，让共享账本既开放又可控。</p>
          </article>
          <article className="stat-card">
            <p style={{ margin: 0, color: "var(--muted-foreground)" }}>分析维度</p>
            <strong>多维</strong>
            <p style={{ margin: 0 }} className="body-copy">按时间、分类、成员拆分数据，让每笔钱都有上下文。</p>
          </article>
          <article className="stat-card">
            <p style={{ margin: 0, color: "var(--muted-foreground)" }}>技术底座</p>
            <strong>托管化</strong>
            <p style={{ margin: 0 }} className="body-copy">Next.js、Supabase、Vercel 组合，轻运维也能有完整产品感。</p>
          </article>
        </section>
      </div>
    </main>
  );
}

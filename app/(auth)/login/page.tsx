import { LoginForm } from "@/components/auth/login-form";

interface LoginPageProps {
  searchParams?: Promise<{ next?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = searchParams ? await searchParams : undefined;

  return (
    <main className="shell">
      <div className="container">
        <section className="auth-shell">
          <article className="panel glass-panel auth-visual fade-up">
            <div>
              <span className="section-kicker">Welcome Back</span>
              <h1 className="hero-title" style={{ fontSize: "clamp(2.6rem, 5vw, 4.4rem)" }}>
                让每一笔支出，
                <br />
                都回到有秩序的生活里。
              </h1>
              <p className="hero-copy" style={{ maxWidth: 560 }}>
                登录后你会回到自己的协作账本，继续整理日常收支、共享预算和家庭财务脉络。
              </p>
            </div>
            <div className="auth-metrics">
              <div className="metric-card">
                <strong>实时</strong>
                <p style={{ margin: 0 }} className="body-copy">多人协作账本同步查看。</p>
              </div>
              <div className="metric-card">
                <strong>清晰</strong>
                <p style={{ margin: 0 }} className="body-copy">分类、标签和时间维度一目了然。</p>
              </div>
              <div className="metric-card">
                <strong>可控</strong>
                <p style={{ margin: 0 }} className="body-copy">权限和 RLS 双层隔离。</p>
              </div>
            </div>
          </article>
          <section className="panel glass-panel auth-panel fade-up stagger-1">
            <span className="section-kicker">Sign In</span>
            <h2 style={{ margin: "16px 0 10px", fontSize: 42 }}>登录</h2>
            <p className="body-copy" style={{ marginTop: 0 }}>
              使用 Supabase Auth 邮箱登录，成功后会写入会话 Cookie 并跳转到控制台。
            </p>
            <LoginForm next={params?.next ?? "/dashboard"} />
          </section>
        </section>
      </div>
    </main>
  );
}

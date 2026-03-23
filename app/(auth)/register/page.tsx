import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <main className="shell">
      <div className="container">
        <section className="auth-shell">
          <article className="panel glass-panel auth-visual fade-up">
            <div>
              <span className="section-kicker">New Account</span>
              <h1 className="hero-title" style={{ fontSize: "clamp(2.5rem, 5vw, 4.3rem)" }}>
                为你的账本关系，
                <br />
                建一套耐看的秩序。
              </h1>
              <p className="hero-copy" style={{ maxWidth: 560 }}>
                从一个账号开始，把伴侣、家庭成员或团队伙伴接进同一账本，把琐碎记录变成可追踪的共识。
              </p>
            </div>
            <div className="auth-metrics">
              <div className="metric-card">
                <strong>共享</strong>
                <p style={{ margin: 0 }} className="body-copy">邀请成员进入同一个账本。</p>
              </div>
              <div className="metric-card">
                <strong>分层</strong>
                <p style={{ margin: 0 }} className="body-copy">角色权限天然分明。</p>
              </div>
              <div className="metric-card">
                <strong>分析</strong>
                <p style={{ margin: 0 }} className="body-copy">后续可直接接图表与报表。</p>
              </div>
            </div>
          </article>
          <section className="panel glass-panel auth-panel fade-up stagger-1">
            <span className="section-kicker">Create Account</span>
            <h2 style={{ margin: "16px 0 10px", fontSize: 42 }}>注册</h2>
            <p className="body-copy" style={{ marginTop: 0 }}>
              注册成功后，数据库触发器会自动创建 <code>profiles</code> 记录，并进入后续登录或直接登录状态。
            </p>
            <RegisterForm />
          </section>
        </section>
      </div>
    </main>
  );
}

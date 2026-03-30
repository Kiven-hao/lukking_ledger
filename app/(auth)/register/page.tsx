import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <main className="shell">
      <div className="container">
        <section className="auth-shell">
          <article className="panel glass-panel auth-visual fade-up">
            <div>
              <span className="section-kicker">Begin Your Ledger</span>
              <h1
                className="hero-title"
                style={{ fontSize: "clamp(2.4rem, 5vw, 4.2rem)" }}
              >
                把散落的账目，
                <br />
                编成一部可传阅的经卷。
              </h1>
              <p className="hero-copy" style={{ maxWidth: 560 }}>
                一次注册，便可与伴侣、家人或合伙人共执一册账簿——让每笔流水不再孤立，而是彼此关联、有迹可循的叙事。
              </p>
            </div>
            <div className="auth-metrics">
              <div className="metric-card">
                <strong style={{ color: "var(--gold-bright)" }}>共治</strong>
                <p style={{ margin: 0 }} className="body-copy">
                  多人共执笔墨，权责自明。
                </p>
              </div>
              <div className="metric-card">
                <strong style={{ color: "var(--gold-bright)" }}>溯源</strong>
                <p style={{ margin: 0 }} className="body-copy">
                  每笔流水皆可回溯至初始语境。
                </p>
              </div>
              <div className="metric-card">
                <strong style={{ color: "var(--gold-bright)" }}>演化</strong>
                <p style={{ margin: 0 }} className="body-copy">
                  数据沉淀为趋势，趋势生长为洞见。
                </p>
              </div>
            </div>
          </article>

          <section className="panel glass-panel auth-panel fade-up stagger-1">
            <span className="section-kicker">Create Account</span>
            <h2 style={{ margin: "16px 0 10px", fontSize: 42 }}>注册</h2>
            <p className="body-copy" style={{ marginTop: 0 }}>
              落笔即立约——注册完成后系统将自动生成你的专属档案，随即可邀人共览、分权协作。
            </p>
            <RegisterForm />
          </section>
        </section>
      </div>
    </main>
  );
}

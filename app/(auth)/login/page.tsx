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
          {/* ── Left: Visual Panel ── */}
          <article className="panel glass-panel auth-visual fade-up">
            <div>
              {/* Brand mark */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 32,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "var(--r-md)",
                    background:
                      "linear-gradient(135deg, var(--gold) 0%, var(--gold-dim) 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    fontWeight: 700,
                    color: "var(--text-inverse)",
                    boxShadow: "0 0 20px rgba(201, 169, 110, 0.2)",
                  }}
                >
                  簿
                </div>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    color: "var(--text-tertiary)",
                    textTransform: "uppercase" as const,
                  }}
                >
                  墨韵金簿
                </span>
              </div>

              <span className="section-kicker">Welcome Back</span>

              <h1
                className="hero-title"
                style={{ fontSize: "clamp(2.4rem, 5vw, 4.2rem)" }}
              >
                归来翻旧帙，
                <br />
                灯下理清账。
              </h1>

              <p className="hero-copy" style={{ maxWidth: 520 }}>
                每一笔记录都是生活的注脚。登录后，你将回到自己的协作账本——
                继续打理日常收支、共享预算，与家人一起书写有序的财务脉络。
              </p>

              {/* Decorative divider */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  margin: "28px 0 0",
                }}
              >
                <div className="soft-divider" style={{ flex: 1 }} />
                <span
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.2em",
                    color: "var(--gold-dim)",
                    fontWeight: 600,
                  }}
                >
                  ✦
                </span>
                <div className="soft-divider" style={{ flex: 1 }} />
              </div>
            </div>

            {/* Metric cards */}
            <div className="auth-metrics">
              <div className="metric-card">
                <strong
                  style={{
                    background:
                      "linear-gradient(135deg, var(--gold-bright), var(--gold))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  实时
                </strong>
                <p style={{ margin: 0 }} className="body-copy">
                  多人协作，账目同步更新可见。
                </p>
              </div>
              <div className="metric-card">
                <strong
                  style={{
                    background:
                      "linear-gradient(135deg, var(--gold-bright), var(--gold))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  清晰
                </strong>
                <p style={{ margin: 0 }} className="body-copy">
                  分类标签与时间维度，一目了然。
                </p>
              </div>
              <div className="metric-card">
                <strong
                  style={{
                    background:
                      "linear-gradient(135deg, var(--gold-bright), var(--gold))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  可控
                </strong>
                <p style={{ margin: 0 }} className="body-copy">
                  权限隔离与行级安全，层层设防。
                </p>
              </div>
            </div>
          </article>

          {/* ── Right: Form Panel ── */}
          <section className="panel glass-panel auth-panel fade-up stagger-1">
            {/* Decorative top rule */}
            <div
              style={{
                width: 48,
                height: 2,
                borderRadius: "var(--r-full)",
                background:
                  "linear-gradient(90deg, var(--gold), var(--gold-dim))",
                marginBottom: 24,
                opacity: 0.7,
              }}
            />

            <span className="section-kicker">Sign In</span>

            <h2
              style={{
                margin: "16px 0 6px",
                fontSize: 44,
                letterSpacing: "-0.03em",
                fontWeight: 600,
                color: "var(--text-primary)",
              }}
            >
              登录
            </h2>

            <p
              className="body-copy"
              style={{
                marginTop: 0,
                marginBottom: 4,
                color: "var(--text-secondary)",
              }}
            >
              开卷即续前缘——输入凭证，回到你的账本世界。
            </p>

            <div className="soft-divider" style={{ margin: "20px 0" }} />

            <LoginForm next={params?.next ?? "/dashboard"} />

            {/* Footer note */}
            <p
              style={{
                marginTop: 24,
                marginBottom: 0,
                fontSize: 12,
                color: "var(--text-tertiary)",
                lineHeight: 1.7,
                textAlign: "center" as const,
              }}
            >
              登录即表示你同意我们的服务条款。
              <br />
              数据由 Supabase 加密存储，安心托付。
            </p>
          </section>
        </section>
      </div>
    </main>
  );
}

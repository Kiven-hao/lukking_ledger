import Link from "next/link";

export default function HomePage() {
  return (
    <main className="shell">
      <div className="container grid" style={{ gap: 0 }}>

        {/* ━━━ Hero Section ━━━ */}
        <section
          className="panel glass-panel page-header fade-up"
          style={{
            padding: "56px 40px 48px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderBottom: "none",
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }}
        >
          {/* Decorative top flourish */}
          <div
            style={{
              width: 60,
              height: 1,
              background: "linear-gradient(90deg, transparent, var(--gold), transparent)",
              marginBottom: 28,
            }}
          />

          <span className="section-kicker">Collaborative Ledger Studio</span>

          <h1
            className="hero-title"
            style={{
              maxWidth: 800,
              margin: "24px auto 0",
              lineHeight: 1.05,
            }}
          >
            Lukking Ledger
          </h1>

          <p
            style={{
              margin: "20px auto 0",
              maxWidth: 600,
              fontSize: 20,
              lineHeight: 1.9,
              color: "var(--text-secondary)",
              letterSpacing: "0.04em",
            }}
          >
            墨落金簿，笔笔有序。
            <br />
            将家庭、情侣与小团队的每一笔收支，编排成一本精心共著的账册。
          </p>

          {/* Decorative divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              margin: "32px 0 28px",
            }}
          >
            <div
              style={{
                width: 40,
                height: 1,
                background: "linear-gradient(90deg, transparent, var(--gold-dim))",
              }}
            />
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "var(--r-full)",
                background: "var(--gold)",
                boxShadow: "0 0 12px rgba(91, 92, 240, 0.35)",
              }}
            />
            <div
              style={{
                width: 40,
                height: 1,
                background: "linear-gradient(90deg, var(--gold-dim), transparent)",
              }}
            />
          </div>

          <div className="button-row" style={{ justifyContent: "center" }}>
            <Link href="/login" className="button-primary">
              进入账本
            </Link>
            <Link href="/register" className="button-secondary">
              创建账号
            </Link>
            <Link href="/dashboard" className="button-ghost">
              直接预览控制台 →
            </Link>
          </div>
        </section>

        {/* Seamless connector */}
        <div className="soft-divider" />

        {/* ━━━ Feature Cards ━━━ */}
        <section
          className="fade-up stagger-1"
          style={{ padding: "48px 0 0" }}
        >
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <span className="section-kicker">Core Features</span>
            <h2
              className="page-title"
              style={{
                marginTop: 16,
                background: "linear-gradient(135deg, var(--text-primary) 30%, var(--gold-bright) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              为协作而生的记账体验
            </h2>
            <p
              className="hero-copy"
              style={{
                maxWidth: 520,
                margin: "12px auto 0",
                textAlign: "center",
              }}
            >
              不只是数字的容器，更是一套让财务协作变得清晰、优雅的秩序系统。
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 16,
            }}
          >
            {/* Feature 1 */}
            <article
              className="panel glass-panel fade-up stagger-1"
              style={{ padding: "32px 28px", display: "grid", gap: 14 }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "var(--r-md)",
                  background: "var(--gold-glow)",
                  border: "1px solid rgba(91, 92, 240, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                }}
              >
                📖
              </div>
              <div>
                <span
                  className="badge"
                  style={{ marginBottom: 8, display: "inline-block" }}
                >
                  多人协作
                </span>
                <h3
                  style={{
                    margin: "10px 0 6px",
                    fontSize: 22,
                    color: "var(--text-primary)",
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                  }}
                >
                  一本账簿，多人共著
                </h3>
                <p className="body-copy" style={{ margin: 0 }}>
                  邀请家人、伴侣或室友加入同一账本。每笔记录都标注作者，收支动态实时可见，不再需要截图对账或群内接龙。
                </p>
              </div>
            </article>

            {/* Feature 2 */}
            <article
              className="panel glass-panel fade-up stagger-2"
              style={{ padding: "32px 28px", display: "grid", gap: 14 }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "var(--r-md)",
                  background: "var(--gold-glow)",
                  border: "1px solid rgba(91, 92, 240, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                }}
              >
                📊
              </div>
              <div>
                <span
                  className="badge"
                  style={{ marginBottom: 8, display: "inline-block" }}
                >
                  分类分析
                </span>
                <h3
                  style={{
                    margin: "10px 0 6px",
                    fontSize: 22,
                    color: "var(--text-primary)",
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                  }}
                >
                  每笔钱都有上下文
                </h3>
                <p className="body-copy" style={{ margin: 0 }}>
                  自定义分类体系，按时间、成员、类别多维拆分数据。月度趋势、支出占比、收入结构——一目了然，无需手动汇总。
                </p>
              </div>
            </article>

            {/* Feature 3 */}
            <article
              className="panel glass-panel fade-up stagger-3"
              style={{ padding: "32px 28px", display: "grid", gap: 14 }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "var(--r-md)",
                  background: "var(--gold-glow)",
                  border: "1px solid rgba(91, 92, 240, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                }}
              >
                🔐
              </div>
              <div>
                <span
                  className="badge"
                  style={{ marginBottom: 8, display: "inline-block" }}
                >
                  角色权限
                </span>
                <h3
                  style={{
                    margin: "10px 0 6px",
                    fontSize: 22,
                    color: "var(--text-primary)",
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                  }}
                >
                  开放而有边界
                </h3>
                <p className="body-copy" style={{ margin: 0 }}>
                  Owner、Editor、Viewer 三级权限分层。账本创建者掌握全局，协作者各得其所——既不封闭，也不失控。
                </p>
              </div>
            </article>
          </div>
        </section>

        {/* ━━━ Decorative Divider ━━━ */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            padding: "48px 0",
          }}
        >
          <div
            style={{
              flex: 1,
              maxWidth: 200,
              height: 1,
              background: "linear-gradient(90deg, transparent, var(--border))",
            }}
          />
          <span
            style={{
              fontSize: 11,
              color: "var(--gold-dim)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            ✦
          </span>
          <div
            style={{
              flex: 1,
              maxWidth: 200,
              height: 1,
              background: "linear-gradient(90deg, var(--border), transparent)",
            }}
          />
        </div>

        {/* ━━━ How It Works ━━━ */}
        <section className="fade-up stagger-2">
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <span className="section-kicker">How It Works</span>
            <h2
              className="page-title"
              style={{
                marginTop: 16,
                background: "linear-gradient(135deg, var(--text-primary) 30%, var(--gold-bright) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              三步开启协作记账
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 20,
              position: "relative",
            }}
          >
            {/* Step 1 */}
            <div
              className="panel fade-up stagger-1"
              style={{
                padding: "36px 28px",
                display: "grid",
                gap: 16,
                background: "var(--bg-surface)",
                borderTop: "2px solid var(--gold-dim)",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "var(--r-full)",
                  background: "linear-gradient(135deg, var(--gold), var(--gold-dim))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-inverse)",
                  fontWeight: 700,
                  fontSize: 18,
                  letterSpacing: "-0.02em",
                  boxShadow: "0 4px 20px rgba(91, 92, 240, 0.2)",
                }}
              >
                01
              </div>
              <h3
                style={{
                  margin: 0,
                  fontSize: 20,
                  color: "var(--text-primary)",
                  fontWeight: 600,
                }}
              >
                创建或加入账本
              </h3>
              <p className="body-copy" style={{ margin: 0 }}>
                注册后即可创建属于自己的账本，或通过邀请链接加入他人的共享账本。每本账簿都是一个独立的财务空间。
              </p>
            </div>

            {/* Step 2 */}
            <div
              className="panel fade-up stagger-2"
              style={{
                padding: "36px 28px",
                display: "grid",
                gap: 16,
                background: "var(--bg-surface)",
                borderTop: "2px solid var(--gold)",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "var(--r-full)",
                  background: "linear-gradient(135deg, var(--gold), var(--gold-dim))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-inverse)",
                  fontWeight: 700,
                  fontSize: 18,
                  letterSpacing: "-0.02em",
                  boxShadow: "0 4px 20px rgba(91, 92, 240, 0.2)",
                }}
              >
                02
              </div>
              <h3
                style={{
                  margin: 0,
                  fontSize: 20,
                  color: "var(--text-primary)",
                  fontWeight: 600,
                }}
              >
                记录每一笔交易
              </h3>
              <p className="body-copy" style={{ margin: 0 }}>
                收入、支出、转账——选择类型、填写金额、标注分类。每笔记录自动关联作者与时间，形成清晰的资金流水。
              </p>
            </div>

            {/* Step 3 */}
            <div
              className="panel fade-up stagger-3"
              style={{
                padding: "36px 28px",
                display: "grid",
                gap: 16,
                background: "var(--bg-surface)",
                borderTop: "2px solid var(--gold-bright)",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "var(--r-full)",
                  background: "linear-gradient(135deg, var(--gold-bright), var(--gold))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-inverse)",
                  fontWeight: 700,
                  fontSize: 18,
                  letterSpacing: "-0.02em",
                  boxShadow: "0 4px 20px rgba(120, 121, 241, 0.25)",
                }}
              >
                03
              </div>
              <h3
                style={{
                  margin: 0,
                  fontSize: 20,
                  color: "var(--text-primary)",
                  fontWeight: 600,
                }}
              >
                洞察与分析
              </h3>
              <p className="body-copy" style={{ margin: 0 }}>
                数据自动聚合为多维分析视图。按时间趋势、分类占比、成员贡献拆解财务全貌，让每一分钱的去向都清晰可溯。
              </p>
            </div>
          </div>
        </section>

        {/* ━━━ Decorative Divider ━━━ */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            padding: "48px 0",
          }}
        >
          <div
            style={{
              flex: 1,
              maxWidth: 200,
              height: 1,
              background: "linear-gradient(90deg, transparent, var(--border))",
            }}
          />
          <span
            style={{
              fontSize: 11,
              color: "var(--gold-dim)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            ✦
          </span>
          <div
            style={{
              flex: 1,
              maxWidth: 200,
              height: 1,
              background: "linear-gradient(90deg, var(--border), transparent)",
            }}
          />
        </div>

        {/* ━━━ Stats Section ━━━ */}
        <section className="fade-up stagger-3">
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <span className="section-kicker">Platform Capabilities</span>
            <h2
              className="page-title"
              style={{
                marginTop: 16,
                background: "linear-gradient(135deg, var(--text-primary) 30%, var(--gold-bright) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              一套完整的协作基座
            </h2>
          </div>

          <div className="stats-grid">
            <article className="stat-card fade-up stagger-1">
              <p style={{ margin: 0, color: "var(--text-tertiary)", fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                协作模式
              </p>
              <strong>3 级权限</strong>
              <p className="body-copy" style={{ margin: 0 }}>
                Owner / Editor / Viewer 分层管控，共享与隐私并存。
              </p>
            </article>

            <article className="stat-card fade-up stagger-2">
              <p style={{ margin: 0, color: "var(--text-tertiary)", fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                分析维度
              </p>
              <strong>多维洞察</strong>
              <p className="body-copy" style={{ margin: 0 }}>
                时间 × 分类 × 成员，任意组合拆分财务数据。
              </p>
            </article>

            <article className="stat-card fade-up stagger-3">
              <p style={{ margin: 0, color: "var(--text-tertiary)", fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                交易类型
              </p>
              <strong>收 · 支 · 转</strong>
              <p className="body-copy" style={{ margin: 0 }}>
                涵盖收入、支出与转账三大资金流向，完整覆盖日常场景。
              </p>
            </article>

            <article className="stat-card fade-up stagger-4">
              <p style={{ margin: 0, color: "var(--text-tertiary)", fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                技术底座
              </p>
              <strong>云端托管</strong>
              <p className="body-copy" style={{ margin: 0 }}>
                Next.js + Supabase + Vercel，零运维也能拥有完整产品体验。
              </p>
            </article>
          </div>
        </section>

        {/* ━━━ Philosophy Quote ━━━ */}
        <section
          className="panel glass-panel fade-up stagger-4"
          style={{
            marginTop: 48,
            padding: "48px 40px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderTop: "1px solid rgba(91, 92, 240, 0.10)",
          }}
        >
          <div
            style={{
              fontSize: 32,
              color: "var(--gold)",
              lineHeight: 1,
              marginBottom: 20,
              opacity: 0.5,
              fontFamily: "inherit",
            }}
          >
            &ldquo;
          </div>
          <blockquote
            style={{
              margin: 0,
              maxWidth: 640,
              fontSize: 19,
              lineHeight: 2,
              color: "var(--text-secondary)",
              fontStyle: "italic",
              letterSpacing: "0.02em",
            }}
          >
            记账不是枯燥的数字罗列，而是对生活节奏的一种觉察。当多人共同书写同一本账簿，它便成为一段关系中信任与透明的注脚。
          </blockquote>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              margin: "28px 0 32px",
            }}
          >
            <div
              style={{
                width: 32,
                height: 1,
                background: "linear-gradient(90deg, transparent, var(--gold-dim))",
              }}
            />
            <span
              style={{
                fontSize: 12,
                color: "var(--gold-dim)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              Lukking Ledger
            </span>
            <div
              style={{
                width: 32,
                height: 1,
                background: "linear-gradient(90deg, var(--gold-dim), transparent)",
              }}
            />
          </div>

          <div className="button-row" style={{ justifyContent: "center" }}>
            <Link href="/register" className="button-primary">
              开始记录你们的故事
            </Link>
            <Link href="/login" className="button-ghost">
              已有账号？登录 →
            </Link>
          </div>
        </section>

        {/* ━━━ Footer ━━━ */}
        <footer
          className="fade-up stagger-4"
          style={{
            marginTop: 56,
            paddingTop: 32,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div className="soft-divider" style={{ width: "100%", marginBottom: 20 }} />
          <p
            style={{
              margin: 0,
              fontSize: 13,
              color: "var(--text-tertiary)",
              letterSpacing: "0.04em",
            }}
          >
            以秩序之名，为共同生活记一本好账。
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 12,
              color: "var(--text-tertiary)",
              opacity: 0.6,
              letterSpacing: "0.06em",
            }}
          >
            Lukking Ledger · 明朗新界
          </p>
        </footer>
      </div>
    </main>
  );
}

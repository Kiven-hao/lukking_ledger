import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/auth/sign-out-button";

const links = [
  { href: "/dashboard", label: "账本列表", desc: "总览全部账本与近期动态" },
  { href: "/dashboard/analytics", label: "分析概览", desc: "收支趋势与分类洞察" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="shell">
      <div className="container dashboard-shell">
        {/* ── Sidebar: book-spine table of contents ── */}
        <aside
          className="panel glass-panel dashboard-sidebar fade-up"
          style={{ position: "relative" }}
        >
          {/* Decorative gold top-border accent */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 0,
              left: "20%",
              right: "20%",
              height: 2,
              borderRadius: "0 0 999px 999px",
              background:
                "linear-gradient(90deg, transparent, var(--gold) 30%, var(--gold-bright) 50%, var(--gold) 70%, transparent)",
              opacity: 0.7,
            }}
          />

          {/* Brand mark */}
          <header style={{ paddingTop: 8 }}>
            <span className="section-kicker">明朗新界</span>
            <h2
              style={{
                margin: "14px 0 0",
                fontSize: 28,
                fontWeight: 600,
                letterSpacing: "-0.03em",
                lineHeight: 1.15,
                background:
                  "linear-gradient(135deg, var(--text-primary) 0%, var(--gold-bright) 50%, var(--text-primary) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Lukking
              <br />
              Ledger
            </h2>
          </header>

          {/* User info */}
          <p
            className="body-copy"
            style={{
              margin: 0,
              fontSize: 13,
              lineHeight: 1.6,
              color: "var(--text-tertiary)",
            }}
          >
            {user?.email ? (
              <>
                <span
                  style={{
                    display: "block",
                    fontSize: 11,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--text-secondary)",
                    marginBottom: 2,
                  }}
                >
                  当前登录
                </span>
                <span style={{ color: "var(--text-primary)", wordBreak: "break-all" }}>
                  {user.email}
                </span>
              </>
            ) : (
              "未检测到登录状态"
            )}
          </p>

          <div className="soft-divider" />

          {/* Navigation — table of contents */}
          <nav style={{ display: "grid", gap: 10 }}>
            <span
              style={{
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--text-tertiary)",
                fontWeight: 700,
                paddingLeft: 2,
              }}
            >
              目录
            </span>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href as never}
                className="nav-card"
              >
                <strong>{link.label}</strong>
                <span className="body-copy" style={{ fontSize: 13, margin: 0 }}>
                  {link.desc}
                </span>
              </Link>
            ))}
          </nav>

          <div className="soft-divider" />

          {/* Sign-out */}
          <div style={{ marginTop: "auto" }}>
            <SignOutButton />
          </div>
        </aside>

        {/* ── Main content area ── */}
        <section>{children}</section>
      </div>
    </main>
  );
}

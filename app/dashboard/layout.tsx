import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/auth/sign-out-button";

const links = [
  { href: "/dashboard", label: "账本列表" },
  { href: "/dashboard/analytics", label: "分析概览" },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="shell">
      <div className="container dashboard-shell">
        <aside className="panel glass-panel dashboard-sidebar fade-up">
          <div>
            <span className="section-kicker">Control Deck</span>
            <h2 style={{ margin: "16px 0 10px", fontSize: 34 }}>Lukking Ledger</h2>
          </div>
          <p className="body-copy" style={{ margin: 0 }}>
            {user?.email ? <>当前登录：<br />{user.email}</> : "未检测到登录状态"}
          </p>
          <nav style={{ display: "grid", gap: 12 }}>
            {links.map((link) => (
              <Link key={link.href} href={link.href as never} className="nav-card">
                <strong>{link.label}</strong>
                <span className="body-copy">继续查看这一部分的账本动态。</span>
              </Link>
            ))}
          </nav>
          <div className="soft-divider" />
          <div>
            <SignOutButton />
          </div>
        </aside>
        <section>{children}</section>
      </div>
    </main>
  );
}

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
      <div className="container" style={{ display: "grid", gridTemplateColumns: "260px minmax(0, 1fr)", gap: 20 }}>
        <aside className="panel" style={{ padding: 24, alignSelf: "start", position: "sticky", top: 20 }}>
          <h2 style={{ marginTop: 0 }}>Lukking Ledger</h2>
          <p style={{ color: "var(--muted-foreground)", lineHeight: 1.6 }}>
            {user?.email ? <>当前登录：<br />{user.email}</> : "未检测到登录状态"}
          </p>
          <nav style={{ display: "grid", gap: 12 }}>
            {links.map((link) => (
              <Link key={link.href} href={link.href as never} className="panel" style={{ padding: "12px 14px" }}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div style={{ marginTop: 16 }}>
            <SignOutButton />
          </div>
        </aside>
        <section>{children}</section>
      </div>
    </main>
  );
}

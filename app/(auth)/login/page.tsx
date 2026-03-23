import { LoginForm } from "@/components/auth/login-form";

interface LoginPageProps {
  searchParams?: Promise<{ next?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = searchParams ? await searchParams : undefined;

  return (
    <main className="shell">
      <div className="container">
        <section className="panel" style={{ padding: 32, maxWidth: 540, margin: "0 auto" }}>
          <h1 style={{ marginTop: 0 }}>登录</h1>
          <p style={{ color: "var(--muted-foreground)", lineHeight: 1.7 }}>
            使用 Supabase Auth 邮箱登录，成功后会写入会话 Cookie 并跳转到控制台。
          </p>
          <LoginForm next={params?.next ?? "/dashboard"} />
        </section>
      </div>
    </main>
  );
}

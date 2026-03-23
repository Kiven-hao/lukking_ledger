import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <main className="shell">
      <div className="container">
        <section className="panel" style={{ padding: 32, maxWidth: 540, margin: "0 auto" }}>
          <h1 style={{ marginTop: 0 }}>注册</h1>
          <p style={{ color: "var(--muted-foreground)", lineHeight: 1.7 }}>
            注册成功后，数据库触发器会自动创建 <code>profiles</code> 记录，并进入后续登录或直接登录状态。
          </p>
          <RegisterForm />
        </section>
      </div>
    </main>
  );
}

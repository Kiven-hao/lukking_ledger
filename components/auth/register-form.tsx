"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerAction, type FormState } from "@/app/actions/auth";

const initialState: FormState = { error: null, success: null };

export function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, initialState);

  return (
    <form action={action} className="grid" style={{ gap: 16 }}>
      <label style={{ display: "grid", gap: 8 }}>
        <span>昵称</span>
        <input
          name="nickname"
          type="text"
          placeholder="给自己起个名字"
          className="panel"
          style={{ padding: "14px 16px", border: "1px solid var(--border)", background: "white" }}
        />
      </label>
      <label style={{ display: "grid", gap: 8 }}>
        <span>邮箱</span>
        <input
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          className="panel"
          style={{ padding: "14px 16px", border: "1px solid var(--border)", background: "white" }}
        />
      </label>
      <label style={{ display: "grid", gap: 8 }}>
        <span>密码</span>
        <input
          name="password"
          type="password"
          placeholder="至少 6 位"
          required
          minLength={6}
          className="panel"
          style={{ padding: "14px 16px", border: "1px solid var(--border)", background: "white" }}
        />
      </label>
      {state.error ? (
        <p style={{ margin: 0, color: "#b42318", background: "#fff2f0", borderRadius: 14, padding: "12px 14px" }}>{state.error}</p>
      ) : null}
      {state.success ? (
        <p style={{ margin: 0, color: "var(--accent)", background: "#eefaf6", borderRadius: 14, padding: "12px 14px" }}>{state.success}</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="panel"
        style={{ padding: "14px 18px", background: "var(--accent)", color: "var(--accent-foreground)", cursor: "pointer" }}
      >
        {pending ? "注册中..." : "创建账号"}
      </button>
      <p style={{ margin: 0, color: "var(--muted-foreground)" }}>
        已有账号？<Link href="/login" style={{ color: "var(--accent)" }}>去登录</Link>
      </p>
    </form>
  );
}

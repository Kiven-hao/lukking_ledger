"use client";

import { useActionState } from "react";
import { loginAction, type FormState } from "@/app/actions/auth";

const initialState: FormState = { error: null };

export function LoginForm({ next = "/dashboard" }: { next?: string }) {
  const [state, action, pending] = useActionState(loginAction, initialState);

  return (
    <form action={action} className="grid" style={{ gap: 16 }}>
      <input type="hidden" name="next" value={next} />
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
          placeholder="请输入密码"
          required
          className="panel"
          style={{ padding: "14px 16px", border: "1px solid var(--border)", background: "white" }}
        />
      </label>
      {state.error ? (
        <p style={{ margin: 0, color: "#b42318", background: "#fff2f0", borderRadius: 14, padding: "12px 14px" }}>{state.error}</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="panel"
        style={{ padding: "14px 18px", background: "var(--accent)", color: "var(--accent-foreground)", cursor: "pointer" }}
      >
        {pending ? "登录中..." : "登录"}
      </button>
    </form>
  );
}

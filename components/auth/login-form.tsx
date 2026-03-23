"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction, type FormState } from "@/app/actions/auth";

const initialState: FormState = { error: null };

export function LoginForm({ next = "/dashboard" }: { next?: string }) {
  const [state, action, pending] = useActionState(loginAction, initialState);

  return (
    <form action={action} className="form-stack">
      <input type="hidden" name="next" value={next} />
      <label className="field-group">
        <span className="field-label">邮箱</span>
        <input
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          className="field"
        />
      </label>
      <label className="field-group">
        <span className="field-label">密码</span>
        <input
          name="password"
          type="password"
          placeholder="请输入密码"
          required
          className="field"
        />
      </label>
      {state.error ? <p className="alert-error">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="button-primary"
      >
        {pending ? "登录中..." : "登录"}
      </button>
      <p style={{ margin: 0 }} className="body-copy">
        还没有账号？<Link href="/register" style={{ color: "var(--accent-strong)" }}>先去注册</Link>
      </p>
    </form>
  );
}

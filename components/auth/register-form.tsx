"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerAction, type FormState } from "@/app/actions/auth";

const initialState: FormState = { error: null, success: null };

export function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, initialState);

  return (
    <form action={action} className="form-stack">
      <label className="field-group">
        <span className="field-label">昵称</span>
        <input
          name="nickname"
          type="text"
          placeholder="给自己起个名字"
          className="field"
        />
      </label>
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
          placeholder="至少 6 位"
          required
          minLength={6}
          className="field"
        />
      </label>
      {state.error ? <p className="alert-error">{state.error}</p> : null}
      {state.success ? <p className="alert-success">{state.success}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="button-primary"
      >
        {pending ? "注册中..." : "创建账号"}
      </button>
      <p style={{ margin: 0 }} className="body-copy">
        已有账号？<Link href="/login" style={{ color: "var(--accent)" }}>去登录</Link>
      </p>
    </form>
  );
}

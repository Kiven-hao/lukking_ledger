"use client";

import { useTransition } from "react";
import { signOutAction } from "@/app/actions/auth";

export function SignOutButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => startTransition(async () => signOutAction())}
      className="panel"
      style={{ padding: "12px 14px", cursor: "pointer", background: "#fff7ed" }}
    >
      {pending ? "退出中..." : "退出登录"}
    </button>
  );
}

"use client";

import { useTransition } from "react";
import { signOutAction } from "@/app/actions/auth";

export function SignOutButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => startTransition(async () => signOutAction())}
      className="button-secondary"
    >
      {pending ? "退出中..." : "退出登录"}
    </button>
  );
}

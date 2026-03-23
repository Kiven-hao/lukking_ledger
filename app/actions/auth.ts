"use server";

import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";

export interface FormState {
  error: string | null;
  success?: string | null;
}

export async function loginAction(_: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/dashboard");

  if (!email || !password) {
    return { error: "请输入邮箱和密码" };
  }

  const supabase = await createSupabaseServer();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  redirect(next.startsWith("/") ? next : "/dashboard");
}

export async function signOutAction() {
  const supabase = await createSupabaseServer();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function registerAction(_: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const nickname = String(formData.get("nickname") ?? "").trim();

  if (!email || !password) {
    return { error: "请输入邮箱和密码", success: null };
  }

  if (password.length < 6) {
    return { error: "密码至少需要 6 位", success: null };
  }

  const supabase = await createSupabaseServer();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nickname,
      },
    },
  });

  if (error) {
    return { error: error.message, success: null };
  }

  if (data.session) {
    redirect("/dashboard");
  }

  return {
    error: null,
    success: "注册成功。若已开启邮箱确认，请先完成验证再登录。",
  };
}

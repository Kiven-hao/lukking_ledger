"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/lib/supabase/server";
import { createLedgerSchema, createTransactionSchema } from "@/lib/validations/ledger";

export interface ActionState {
  error: string | null;
  success?: boolean;
}

export async function createLedgerAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "请先登录后再创建账本" };
  }

  const parsed = createLedgerSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    icon: formData.get("icon") || "book",
    currency: formData.get("currency") || "CNY",
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().formErrors.join(", ") || "账本信息不完整" };
  }

  const ledgerId = crypto.randomUUID();

  const { error: ledgerError } = await supabase
    .from("ledgers")
    .insert({
      id: ledgerId,
      ...parsed.data,
      description: parsed.data.description ?? null,
      icon: parsed.data.icon ?? "book",
      currency: parsed.data.currency.toUpperCase(),
      owner_id: user.id,
    })

  if (ledgerError) {
    return { error: ledgerError.message ?? "创建账本失败" };
  }

  const { error: memberError } = await supabase.from("ledger_members").insert({
    ledger_id: ledgerId,
    user_id: user.id,
    role: "owner",
  });

  if (memberError) {
    return { error: memberError.message };
  }

  revalidatePath("/dashboard");
  return { error: null, success: true };
}

export async function createTransactionAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "请先登录后再录入交易" };
  }

  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const parsed = createTransactionSchema.safeParse({
    ledger_id: formData.get("ledger_id"),
    category_id: formData.get("category_id") || null,
    amount: formData.get("amount"),
    type: formData.get("type"),
    note: formData.get("note") || null,
    occurred_at: formData.get("occurred_at") ? new Date(String(formData.get("occurred_at"))).toISOString() : undefined,
    tags,
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().formErrors.join(", ") || "交易信息不完整" };
  }

  const { data: ledger, error: ledgerError } = await supabase
    .from("ledgers")
    .select("id, owner_id")
    .eq("id", parsed.data.ledger_id)
    .single();

  if (ledgerError || !ledger) {
    return { error: "账本不存在或你没有访问权限" };
  }

  const { data: membership, error: membershipError } = await supabase
    .from("ledger_members")
    .select("id, role")
    .eq("ledger_id", parsed.data.ledger_id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (membershipError) {
    return { error: membershipError.message };
  }

  if (!membership && ledger.owner_id === user.id) {
    const { error: repairError } = await supabase.from("ledger_members").insert({
      ledger_id: parsed.data.ledger_id,
      user_id: user.id,
      role: "owner",
    });

    if (repairError) {
      return { error: `账本成员关系修复失败：${repairError.message}` };
    }
  } else if (membership?.role === "viewer") {
    return { error: "当前身份仅可查看，不能新增交易" };
  }

  if (parsed.data.category_id) {
    const { data: category, error: categoryError } = await supabase
      .from("categories")
      .select("id, ledger_id, type")
      .eq("id", parsed.data.category_id)
      .single();

    if (categoryError || !category) {
      return { error: "所选分类不存在" };
    }

    if (category.ledger_id !== parsed.data.ledger_id || category.type !== parsed.data.type) {
      return { error: "分类与账本或交易类型不匹配" };
    }
  }

  const transactionId = crypto.randomUUID();

  const { data: insertedTransaction, error } = await supabase
    .from("transactions")
    .insert({
      id: transactionId,
      ...parsed.data,
      category_id: parsed.data.category_id ?? null,
      created_by: user.id,
      note: parsed.data.note ?? null,
      occurred_at: parsed.data.occurred_at ?? new Date().toISOString(),
      tags: parsed.data.tags ?? [],
    })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  if (!insertedTransaction?.id) {
    return { error: "交易写入未确认成功，请稍后刷新后重试" };
  }

  revalidatePath(`/dashboard/ledger/${parsed.data.ledger_id}`);
  return { error: null, success: true };
}

"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/lib/supabase/server";
import { createLedgerSchema, createTransactionSchema } from "@/lib/validations/ledger";
import { logger } from "@/lib/utils/logger";

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
  const ctx = { action: "createTransaction" } as const;

  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      logger.warn(ctx, `Auth failed: ${userError?.message ?? "no session"}`);
      return { error: "请先登录后再录入交易" };
    }

    const logCtx = { ...ctx, userId: user.id };

    // ── Parse & validate form input ──────────────────────────────
    const rawOccurredAt = formData.get("occurred_at");
    let parsedOccurredAt: string | undefined;
    if (rawOccurredAt) {
      const d = new Date(String(rawOccurredAt));
      if (Number.isNaN(d.getTime())) {
        logger.warn(logCtx, `Invalid occurred_at value: ${String(rawOccurredAt)}`);
        return { error: "交易日期格式不正确" };
      }
      parsedOccurredAt = d.toISOString();
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
      occurred_at: parsedOccurredAt,
      tags,
    });

    if (!parsed.success) {
      logger.warn(logCtx, `Validation failed: ${parsed.error.flatten().formErrors.join(", ")}`);
      return { error: parsed.error.flatten().formErrors.join(", ") || "交易信息不完整" };
    }

    const ledgerId = parsed.data.ledger_id;

    // ── Verify ledger exists and is accessible ───────────────────
    const { data: ledger, error: ledgerError } = await supabase
      .from("ledgers")
      .select("id, owner_id")
      .eq("id", ledgerId)
      .single();

    if (ledgerError || !ledger) {
      logger.warn({ ...logCtx, ledgerId }, `Ledger not found or inaccessible: ${ledgerError?.message ?? "no rows"}`);
      return { error: "账本不存在或你没有访问权限" };
    }

    // ── Check membership & permissions ───────────────────────────
    const { data: membership, error: membershipError } = await supabase
      .from("ledger_members")
      .select("id, role")
      .eq("ledger_id", ledgerId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (membershipError) {
      logger.error({ ...logCtx, ledgerId }, `Membership query error: ${membershipError.message}`);
      return { error: "权限查询失败，请稍后重试" };
    }

    if (!membership && ledger.owner_id === user.id) {
      // Owner exists in ledgers but is missing from ledger_members — auto-repair.
      logger.warn({ ...logCtx, ledgerId }, "Owner membership row missing, attempting repair");
      const { error: repairError } = await supabase.from("ledger_members").insert({
        ledger_id: ledgerId,
        user_id: user.id,
        role: "owner",
      });

      if (repairError) {
        logger.error({ ...logCtx, ledgerId }, `Membership repair failed: ${repairError.message}`);
        return { error: `账本成员关系修复失败：${repairError.message}` };
      }
      logger.info({ ...logCtx, ledgerId }, "Owner membership row repaired successfully");
    } else if (!membership) {
      // User is neither a member nor the owner — deny access.
      logger.warn({ ...logCtx, ledgerId }, "Non-member attempted to create transaction");
      return { error: "你不是该账本的成员，无法新增交易" };
    } else if (membership.role === "viewer") {
      logger.warn({ ...logCtx, ledgerId, role: membership.role }, "Viewer attempted to create transaction");
      return { error: "当前身份仅可查看，不能新增交易" };
    }

    // ── Validate category if provided ────────────────────────────
    if (parsed.data.category_id) {
      const { data: category, error: categoryError } = await supabase
        .from("categories")
        .select("id, ledger_id, type")
        .eq("id", parsed.data.category_id)
        .single();

      if (categoryError || !category) {
        logger.warn({ ...logCtx, ledgerId, categoryId: parsed.data.category_id }, `Category not found: ${categoryError?.message ?? "no rows"}`);
        return { error: "所选分类不存在" };
      }

      if (category.ledger_id !== ledgerId) {
        logger.warn({ ...logCtx, ledgerId, categoryId: parsed.data.category_id }, "Category belongs to a different ledger");
        return { error: "分类与账本不匹配" };
      }

      if (category.type !== parsed.data.type) {
        logger.warn({ ...logCtx, ledgerId, categoryId: parsed.data.category_id }, `Category type mismatch: expected ${parsed.data.type}, got ${category.type}`);
        return { error: "分类与交易类型不匹配" };
      }
    }

    // ── Insert transaction ───────────────────────────────────────
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
      logger.error({ ...logCtx, ledgerId, transactionId }, `Insert failed: ${error.message}`);
      return { error: error.message };
    }

    if (!insertedTransaction?.id) {
      logger.error({ ...logCtx, ledgerId, transactionId }, "Insert returned no id — write not confirmed");
      return { error: "交易写入未确认成功，请稍后刷新后重试" };
    }

    logger.info({ ...logCtx, ledgerId, transactionId: insertedTransaction.id }, "Transaction created");

    revalidatePath(`/dashboard/ledger/${ledgerId}`);
    return { error: null, success: true };
  } catch (unexpected) {
    const message = unexpected instanceof Error ? unexpected.message : String(unexpected);
    logger.error(ctx, `Unhandled exception: ${message}`);
    return { error: "服务器内部错误，请稍后重试" };
  }
}

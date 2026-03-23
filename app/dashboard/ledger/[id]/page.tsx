import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { CreateTransactionForm } from "@/components/ledger/create-transaction-form";
import { TransactionFilters } from "@/components/ledger/transaction-filters";
import { TransactionList } from "@/components/ledger/transaction-list";

interface LedgerPageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{
    type?: string;
    category_id?: string;
    start?: string;
    end?: string;
    keyword?: string;
    cursor_occurred_at?: string;
    cursor_id?: string;
  }>;
}

function toDayBoundary(value: string | undefined, endOfDay = false) {
  if (!value) return undefined;
  return new Date(`${value}T${endOfDay ? "23:59:59" : "00:00:00"}+08:00`).toISOString();
}

function buildPageHref(
  basePath: string,
  current: Record<string, string>,
  next: Record<string, string | null | undefined>,
) {
  const searchParams = new URLSearchParams();
  const merged = { ...current, ...next };

  Object.entries(merged).forEach(([key, value]) => {
    if (value) searchParams.set(key, value);
  });

  const query = searchParams.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export default async function LedgerDetailPage({ params, searchParams }: LedgerPageProps) {
  const { id } = await params;
  const filters = searchParams ? await searchParams : {};
  const supabase = await createSupabaseServer();

  const { data: ledger } = await supabase.from("ledgers").select("*").eq("id", id).single();
  if (!ledger) notFound();

  const currentType = filters.type ?? "";
  const currentCategoryId = filters.category_id ?? "";
  const currentStart = filters.start ?? "";
  const currentEnd = filters.end ?? "";
  const currentKeyword = filters.keyword ?? "";
  const cursorOccurredAt = filters.cursor_occurred_at ?? "";
  const cursorId = filters.cursor_id ?? "";
  const pageSize = 20;

  let transactionQuery = supabase
    .from("transactions")
    .select("id, amount, type, note, occurred_at, tags, category_id, created_by, category:categories(name)")
    .eq("ledger_id", id)
    .order("occurred_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(pageSize + 1);

  if (currentType) transactionQuery = transactionQuery.eq("type", currentType);
  if (currentCategoryId) transactionQuery = transactionQuery.eq("category_id", currentCategoryId);
  if (currentKeyword) transactionQuery = transactionQuery.ilike("note", `%${currentKeyword}%`);

  const startIso = toDayBoundary(currentStart);
  const endIso = toDayBoundary(currentEnd, true);
  if (startIso) transactionQuery = transactionQuery.gte("occurred_at", startIso);
  if (endIso) transactionQuery = transactionQuery.lte("occurred_at", endIso);
  if (cursorOccurredAt) transactionQuery = transactionQuery.lt("occurred_at", cursorOccurredAt);
  if (cursorId && !cursorOccurredAt) transactionQuery = transactionQuery.lt("id", cursorId);

  const [{ data: categories }, transactionResult, { data: members }] = await Promise.all([
    supabase.from("categories").select("id, name, type").eq("ledger_id", id).order("sort_order", { ascending: true }),
    transactionQuery,
    supabase.from("ledger_members").select("role, profile:profiles(nickname)").eq("ledger_id", id).limit(6),
  ]);

  const transactionError = transactionResult.error;
  const transactions = transactionResult.data ?? [];
  const hasMore = transactions.length > pageSize;
  const visibleTransactions = hasMore ? transactions.slice(0, pageSize) : transactions;

  const creatorIds = [...new Set(visibleTransactions.map((item) => item.created_by).filter(Boolean))];
  const { data: creators, error: creatorsError } = creatorIds.length
    ? await supabase.from("profiles").select("id, nickname").in("id", creatorIds)
    : { data: [], error: null };

  const creatorMap = new Map((creators ?? []).map((item) => [item.id, item.nickname]));

  const summary = visibleTransactions.reduce(
    (acc, item) => {
      const amount = Number(item.amount ?? 0);
      if (item.type === "income") acc.income += amount;
      if (item.type === "expense") acc.expense += amount;
      if (item.type === "transfer") acc.transfer += amount;
      return acc;
    },
    { income: 0, expense: 0, transfer: 0 },
  );

  const transactionItems = visibleTransactions.map((item) => {
    const categoryRelation = (item as { category?: { name?: string } | Array<{ name?: string }> | null }).category;

    return {
      id: item.id,
      amount: Number(item.amount ?? 0),
      type: item.type,
      note: item.note,
      occurred_at: item.occurred_at,
      tags: item.tags,
      category_name: Array.isArray(categoryRelation) ? categoryRelation[0]?.name ?? "未分类" : categoryRelation?.name ?? "未分类",
      creator_name: creatorMap.get(item.created_by) ?? "未知成员",
    };
  });

  const nextItem = visibleTransactions[visibleTransactions.length - 1];
  const basePath = `/dashboard/ledger/${id}`;
  const currentParams: Record<string, string> = {
    ...(currentType ? { type: currentType } : {}),
    ...(currentCategoryId ? { category_id: currentCategoryId } : {}),
    ...(currentStart ? { start: currentStart } : {}),
    ...(currentEnd ? { end: currentEnd } : {}),
    ...(currentKeyword ? { keyword: currentKeyword } : {}),
  };
  const nextHref =
    hasMore && nextItem
      ? buildPageHref(basePath, currentParams, {
          cursor_occurred_at: nextItem.occurred_at,
          cursor_id: nextItem.id,
        })
      : null;
  const firstPageHref = buildPageHref(basePath, currentParams, {});

  return (
    <div className="grid">
      <section className="panel glass-panel page-header fade-up">
        <span className="section-kicker">Ledger Detail</span>
        <div className="page-header-top">
          <div>
            <p style={{ margin: 0, color: "var(--muted-foreground)" }}>
              {ledger.icon ?? "book"} · {ledger.currency}
            </p>
            <h1 className="page-title" style={{ marginTop: 10 }}>{ledger.name}</h1>
            <p className="body-copy" style={{ margin: 0 }}>{ledger.description || "还没有账本说明。"}</p>
          </div>
          <div className="button-row">
            <Link href={`/dashboard/ledger/${id}/analytics`} className="action-chip">
              查看分析
            </Link>
            <Link href={`/dashboard/ledger/${id}/settings`} className="action-chip">
              账本设置
            </Link>
          </div>
        </div>
      </section>

      <section className="stats-grid fade-up stagger-1">
        <div className="stat-card">
          <p style={{ margin: 0, color: "var(--muted-foreground)" }}>本页收入</p>
          <strong>{summary.income.toFixed(2)}</strong>
        </div>
        <div className="stat-card">
          <p style={{ margin: 0, color: "var(--muted-foreground)" }}>本页支出</p>
          <strong>{summary.expense.toFixed(2)}</strong>
        </div>
        <div className="stat-card">
          <p style={{ margin: 0, color: "var(--muted-foreground)" }}>本页转账</p>
          <strong>{summary.transfer.toFixed(2)}</strong>
        </div>
        <div className="stat-card">
          <p style={{ margin: 0, color: "var(--muted-foreground)" }}>成员数</p>
          <strong>{members?.length ?? 0}</strong>
        </div>
      </section>

      <section className="panel glass-panel fade-up stagger-2" style={{ padding: 28 }}>
        <h2 style={{ marginTop: 0 }}>新增交易</h2>
        <p className="body-copy" style={{ marginTop: 0 }}>表单会根据交易类型联动分类，让录入动作更短、更顺。</p>
        <CreateTransactionForm ledgerId={id} categories={categories ?? []} />
      </section>

      <section className="panel glass-panel fade-up stagger-3" style={{ padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 18, flexWrap: "wrap" }}>
          <div>
            <h2 style={{ margin: 0 }}>交易列表</h2>
            <p className="body-copy" style={{ margin: "8px 0 0" }}>支持按类型、分类、日期和备注关键字筛选，并使用 cursor 翻页。</p>
          </div>
        </div>
        <div style={{ marginBottom: 18 }}>
          <TransactionFilters
            categories={categories ?? []}
            currentType={currentType}
            currentCategoryId={currentCategoryId}
            currentStart={currentStart}
            currentEnd={currentEnd}
            currentKeyword={currentKeyword}
          />
        </div>
        {transactionError ? <p className="alert-error">交易列表查询失败：{transactionError.message}</p> : null}
        {!transactionError && creatorsError ? <p className="alert-error">用户信息查询失败：{creatorsError.message}</p> : null}
        <TransactionList items={transactionItems} currency={ledger.currency} />
        <div className="button-row" style={{ justifyContent: "space-between", marginTop: 18 }}>
          <Link href={firstPageHref} className="button-secondary">
            回到第一页
          </Link>
          {nextHref ? (
            <Link href={nextHref} className="button-primary">
              下一页
            </Link>
          ) : (
            <span className="body-copy">已经到底了</span>
          )}
        </div>
      </section>
    </div>
  );
}

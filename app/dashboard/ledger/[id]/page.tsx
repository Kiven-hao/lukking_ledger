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
    .select("id, amount, type, note, occurred_at, tags, category:categories(name), creator:profiles(nickname)")
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

  const [{ data: categories }, { data: transactionRows }, { data: members }] = await Promise.all([
    supabase.from("categories").select("id, name, type").eq("ledger_id", id).order("sort_order", { ascending: true }),
    transactionQuery,
    supabase.from("ledger_members").select("role, profile:profiles(nickname)").eq("ledger_id", id).limit(6),
  ]);

  const transactions = transactionRows ?? [];
  const hasMore = transactions.length > pageSize;
  const visibleTransactions = hasMore ? transactions.slice(0, pageSize) : transactions;

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
    const creatorRelation = (item as { creator?: { nickname?: string } | Array<{ nickname?: string }> | null }).creator;

    return {
      id: item.id,
      amount: Number(item.amount ?? 0),
      type: item.type,
      note: item.note,
      occurred_at: item.occurred_at,
      tags: item.tags,
      category_name: Array.isArray(categoryRelation) ? categoryRelation[0]?.name ?? "未分类" : categoryRelation?.name ?? "未分类",
      creator_name: Array.isArray(creatorRelation) ? creatorRelation[0]?.nickname ?? "未知成员" : creatorRelation?.nickname ?? "未知成员",
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
      <section className="panel" style={{ padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "start", flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, color: "var(--muted-foreground)" }}>
              {ledger.icon ?? "book"} · {ledger.currency}
            </p>
            <h1 style={{ margin: "10px 0 8px" }}>{ledger.name}</h1>
            <p style={{ margin: 0, color: "var(--muted-foreground)", lineHeight: 1.7 }}>{ledger.description || "还没有账本说明。"}</p>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href={`/dashboard/ledger/${id}/analytics`} className="panel" style={{ padding: "12px 14px" }}>
              查看分析
            </Link>
            <Link href={`/dashboard/ledger/${id}/settings`} className="panel" style={{ padding: "12px 14px" }}>
              账本设置
            </Link>
          </div>
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        <div className="panel" style={{ padding: 20 }}>
          <p style={{ margin: 0, color: "var(--muted-foreground)" }}>本页收入</p>
          <h2 style={{ marginBottom: 0 }}>{summary.income.toFixed(2)}</h2>
        </div>
        <div className="panel" style={{ padding: 20 }}>
          <p style={{ margin: 0, color: "var(--muted-foreground)" }}>本页支出</p>
          <h2 style={{ marginBottom: 0 }}>{summary.expense.toFixed(2)}</h2>
        </div>
        <div className="panel" style={{ padding: 20 }}>
          <p style={{ margin: 0, color: "var(--muted-foreground)" }}>本页转账</p>
          <h2 style={{ marginBottom: 0 }}>{summary.transfer.toFixed(2)}</h2>
        </div>
        <div className="panel" style={{ padding: 20 }}>
          <p style={{ margin: 0, color: "var(--muted-foreground)" }}>成员数</p>
          <h2 style={{ marginBottom: 0 }}>{members?.length ?? 0}</h2>
        </div>
      </section>

      <section className="panel" style={{ padding: 28 }}>
        <h2 style={{ marginTop: 0 }}>新增交易</h2>
        <CreateTransactionForm ledgerId={id} categories={categories ?? []} />
      </section>

      <section className="panel" style={{ padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 18, flexWrap: "wrap" }}>
          <div>
            <h2 style={{ margin: 0 }}>交易列表</h2>
            <p style={{ margin: "8px 0 0", color: "var(--muted-foreground)" }}>支持按类型、分类、日期和备注关键字筛选，并使用 cursor 翻页。</p>
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
        <TransactionList items={transactionItems} currency={ledger.currency} />
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 18, flexWrap: "wrap" }}>
          <Link href={firstPageHref} className="panel" style={{ padding: "12px 14px" }}>
            回到第一页
          </Link>
          {nextHref ? (
            <Link href={nextHref} className="panel" style={{ padding: "12px 14px", background: "var(--accent)", color: "var(--accent-foreground)" }}>
              下一页
            </Link>
          ) : (
            <span style={{ color: "var(--muted-foreground)" }}>已经到底了</span>
          )}
        </div>
      </section>
    </div>
  );
}

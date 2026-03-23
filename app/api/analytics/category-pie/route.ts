import { fail, ok } from "@/lib/utils/api";
import { requireUser } from "@/lib/utils/auth";
import { safeDateString } from "@/lib/utils/query";

export async function GET(request: Request) {
  const { supabase, response, user } = await requireUser();
  if (response) return response;
  const { searchParams } = new URL(request.url);
  const ledgerId = searchParams.get("ledger_id");
  const type = searchParams.get("type") ?? "expense";
  const start = safeDateString(searchParams.get("start"));
  const end = safeDateString(searchParams.get("end"));

  if (!ledgerId) return fail("ledger_id is required", 422);

  let query = supabase
    .from("transactions")
    .select("amount, category_id, category:categories(id, name, color, icon)")
    .eq("ledger_id", ledgerId)
    .eq("type", type);

  if (start) query = query.gte("occurred_at", start);
  if (end) query = query.lte("occurred_at", end);

  const { data, error } = await query;
  if (error) return fail(error.message);

  const bucket = new Map<
    string,
    { category_id: string | null; category_name: string; color: string | null; icon: string | null; total_amount: number; tx_count: number }
  >();

  for (const item of data ?? []) {
    const category = Array.isArray(item.category) ? item.category[0] : item.category;
    const key = item.category_id ?? "uncategorized";
    const current = bucket.get(key) ?? {
      category_id: item.category_id,
      category_name: category?.name ?? "未分类",
      color: category?.color ?? null,
      icon: category?.icon ?? null,
      total_amount: 0,
      tx_count: 0,
    };

    current.total_amount += Number(item.amount ?? 0);
    current.tx_count += 1;
    bucket.set(key, current);
  }

  const items = [...bucket.values()].sort((a, b) => b.total_amount - a.total_amount);
  return ok(items);
}

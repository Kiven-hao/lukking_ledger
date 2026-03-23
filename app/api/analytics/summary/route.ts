import { fail, ok } from "@/lib/utils/api";
import { requireUser } from "@/lib/utils/auth";
import { safeDateString } from "@/lib/utils/query";

export async function GET(request: Request) {
  const { supabase, response, user } = await requireUser();
  if (response) return response;
  const { searchParams } = new URL(request.url);
  const ledgerId = searchParams.get("ledger_id");
  const start = safeDateString(searchParams.get("start"));
  const end = safeDateString(searchParams.get("end"));

  if (!ledgerId) return fail("ledger_id is required", 422);

  let query = supabase.from("monthly_summary").select("*").eq("ledger_id", ledgerId).order("month", { ascending: true });
  if (start) query = query.gte("month", start);
  if (end) query = query.lte("month", end);

  const { data, error } = await query;
  if (error) return fail(error.message);

  const totals = (data ?? []).reduce(
    (acc, item) => {
      const amount = Number(item.total_amount ?? 0);
      if (item.type === "income") acc.total_income += amount;
      if (item.type === "expense") acc.total_expense += amount;
      if (item.type === "transfer") acc.total_transfer += amount;
      return acc;
    },
    { total_income: 0, total_expense: 0, total_transfer: 0 },
  );

  return ok({ items: data, totals });
}

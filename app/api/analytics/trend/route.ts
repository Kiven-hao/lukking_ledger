import { fail, ok } from "@/lib/utils/api";
import { requireUser } from "@/lib/utils/auth";
import { safeDateString } from "@/lib/utils/query";

const allowedGranularities = new Set(["day", "week", "month"]);

export async function GET(request: Request) {
  const { supabase, response, user } = await requireUser();
  if (response) return response;
  const { searchParams } = new URL(request.url);
  const ledgerId = searchParams.get("ledger_id");
  const start = safeDateString(searchParams.get("start"));
  const end = safeDateString(searchParams.get("end"));
  const granularity = searchParams.get("granularity") ?? "day";

  if (!ledgerId) return fail("ledger_id is required", 422);
  if (!allowedGranularities.has(granularity)) return fail("Invalid granularity", 422);

  let query = supabase.from("transactions").select("amount, type, occurred_at").eq("ledger_id", ledgerId).order("occurred_at", { ascending: true });
  if (start) query = query.gte("occurred_at", start);
  if (end) query = query.lte("occurred_at", end);

  const { data, error } = await query;
  if (error) return fail(error.message);

  const formatter = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: granularity === "month" ? undefined : "2-digit",
  });

  const bucket = new Map<string, { period: string; income: number; expense: number; transfer: number }>();

  for (const item of data ?? []) {
    const date = new Date(item.occurred_at);
    let period = formatter.format(date);

    if (granularity === "week") {
      const day = date.getUTCDay() || 7;
      const monday = new Date(date);
      monday.setUTCDate(date.getUTCDate() - day + 1);
      period = formatter.format(monday);
    }

    const current = bucket.get(period) ?? { period, income: 0, expense: 0, transfer: 0 };
    const amount = Number(item.amount ?? 0);

    if (item.type === "income") current.income += amount;
    if (item.type === "expense") current.expense += amount;
    if (item.type === "transfer") current.transfer += amount;

    bucket.set(period, current);
  }

  return ok([...bucket.values()].sort((a, b) => a.period.localeCompare(b.period)));
}

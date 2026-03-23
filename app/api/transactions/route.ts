import { fail, ok } from "@/lib/utils/api";
import { requireUser } from "@/lib/utils/auth";
import { parsePositiveInt, safeDateString } from "@/lib/utils/query";
import { createTransactionSchema } from "@/lib/validations/ledger";

export async function GET(request: Request) {
  const { supabase, response, user } = await requireUser();
  if (response) return response;
  const { searchParams } = new URL(request.url);

  const ledgerId = searchParams.get("ledger_id");
  if (!ledgerId) return fail("ledger_id is required", 422);

  const limit = Math.min(parsePositiveInt(searchParams.get("limit"), 20), 100);
  const cursorOccurredAt = safeDateString(searchParams.get("cursor_occurred_at"));
  const cursorId = searchParams.get("cursor_id");
  const categoryId = searchParams.get("category_id");
  const type = searchParams.get("type");
  const createdBy = searchParams.get("created_by");
  const start = safeDateString(searchParams.get("start"));
  const end = safeDateString(searchParams.get("end"));

  let query = supabase
    .from("transactions")
    .select("*, category:categories(*), creator:profiles!transactions_created_by_fkey(*)")
    .eq("ledger_id", ledgerId)
    .order("occurred_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(limit + 1);

  if (categoryId) query = query.eq("category_id", categoryId);
  if (type) query = query.eq("type", type);
  if (createdBy) query = query.eq("created_by", createdBy);
  if (start) query = query.gte("occurred_at", start);
  if (end) query = query.lte("occurred_at", end);
  if (cursorOccurredAt) query = query.lt("occurred_at", cursorOccurredAt);
  if (cursorId && !cursorOccurredAt) query = query.lt("id", cursorId);

  const { data, error } = await query;
  if (error) return fail(error.message);

  const hasMore = (data?.length ?? 0) > limit;
  const items = hasMore ? data?.slice(0, limit) : data;
  const nextCursor =
    hasMore && items && items.length > 0
      ? {
          occurred_at: items[items.length - 1]?.occurred_at,
          id: items[items.length - 1]?.id,
        }
      : null;

  return ok({ items, next_cursor: nextCursor });
}

export async function POST(request: Request) {
  const { supabase, response, user } = await requireUser();
  if (response) return response;

  const parsed = createTransactionSchema.safeParse(await request.json());
  if (!parsed.success) return fail(parsed.error.flatten().formErrors.join(", ") || "Invalid payload", 422);

  const payload = parsed.data;

  if (payload.category_id) {
    const { data: category, error: categoryError } = await supabase
      .from("categories")
      .select("id, ledger_id, type")
      .eq("id", payload.category_id)
      .single();

    if (categoryError || !category) return fail("Category not found", 404);
    if (category.ledger_id !== payload.ledger_id) return fail("Category must belong to the same ledger", 422);
    if (category.type !== payload.type) return fail("Category type must match transaction type", 422);
  }

  const { data, error } = await supabase
    .from("transactions")
    .insert({
      ...payload,
      created_by: user.id,
      occurred_at: payload.occurred_at ?? new Date().toISOString(),
      note: payload.note ?? null,
      category_id: payload.category_id ?? null,
      tags: payload.tags ?? [],
    })
    .select()
    .single();

  if (error) return fail(error.message);
  return ok(data, { status: 201 });
}

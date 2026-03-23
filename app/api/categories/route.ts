import { fail, ok } from "@/lib/utils/api";
import { requireUser } from "@/lib/utils/auth";
import { createCategorySchema } from "@/lib/validations/ledger";

function buildCategoryTree(categories: Array<Record<string, unknown>>) {
  const map = new Map<string, Record<string, unknown> & { children: Array<Record<string, unknown>> }>();
  const roots: Array<Record<string, unknown>> = [];

  for (const category of categories) {
    map.set(category.id as string, { ...category, children: [] });
  }

  for (const category of map.values()) {
    if (category.parent_id && map.has(category.parent_id as string)) {
      map.get(category.parent_id as string)?.children.push(category);
    } else {
      roots.push(category);
    }
  }

  return roots;
}

export async function GET(request: Request) {
  const { supabase, response, user } = await requireUser();
  if (response) return response;
  const { searchParams } = new URL(request.url);
  const ledgerId = searchParams.get("ledger_id");

  if (!ledgerId) return fail("ledger_id is required", 422);

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("ledger_id", ledgerId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) return fail(error.message);
  return ok({ items: data, tree: buildCategoryTree(data ?? []) });
}

export async function POST(request: Request) {
  const { supabase, response, user } = await requireUser();
  if (response) return response;

  const parsed = createCategorySchema.safeParse(await request.json());
  if (!parsed.success) return fail(parsed.error.flatten().formErrors.join(", ") || "Invalid payload", 422);

  if (parsed.data.parent_id) {
    const { data: parent, error: parentError } = await supabase
      .from("categories")
      .select("id, ledger_id")
      .eq("id", parsed.data.parent_id)
      .single();

    if (parentError || !parent) return fail("Parent category not found", 404);
    if (parent.ledger_id !== parsed.data.ledger_id) return fail("Parent category must belong to the same ledger", 422);
  }

  const { data, error } = await supabase.from("categories").insert(parsed.data).select().single();
  if (error) return fail(error.message);
  return ok(data, { status: 201 });
}

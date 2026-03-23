import { fail, ok } from "@/lib/utils/api";
import { requireUser } from "@/lib/utils/auth";
import { updateTransactionSchema } from "@/lib/validations/ledger";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteProps) {
  const { supabase, response, user } = await requireUser();
  if (response) return response;
  const { id } = await params;

  const parsed = updateTransactionSchema.safeParse(await request.json());
  if (!parsed.success) return fail(parsed.error.flatten().formErrors.join(", ") || "Invalid payload", 422);

  const payload = parsed.data;

  if (payload.category_id) {
    const { data: transaction, error: transactionError } = await supabase
      .from("transactions")
      .select("ledger_id, type")
      .eq("id", id)
      .single();

    if (transactionError || !transaction) return fail("Transaction not found", 404);

    const targetType = payload.type ?? transaction.type;
    const { data: category, error: categoryError } = await supabase
      .from("categories")
      .select("id, ledger_id, type")
      .eq("id", payload.category_id)
      .single();

    if (categoryError || !category) return fail("Category not found", 404);
    if (category.ledger_id !== transaction.ledger_id) return fail("Category must belong to the same ledger", 422);
    if (category.type !== targetType) return fail("Category type must match transaction type", 422);
  }

  const { data, error } = await supabase
    .from("transactions")
    .update({
      ...payload,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return fail(error.message);
  return ok(data);
}

export async function DELETE(_: Request, { params }: RouteProps) {
  const { supabase, response, user } = await requireUser();
  if (response) return response;
  const { id } = await params;

  const { error } = await supabase.from("transactions").delete().eq("id", id);
  if (error) return fail(error.message);
  return ok({ success: true });
}

import { fail, ok } from "@/lib/utils/api";
import { requireUser } from "@/lib/utils/auth";
import { updateLedgerSchema } from "@/lib/validations/ledger";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function GET(_: Request, { params }: RouteProps) {
  const { supabase, response, user } = await requireUser();
  if (response) return response;
  const { id } = await params;

  const { data, error } = await supabase
    .from("ledgers")
    .select("*, members:ledger_members(*), categories:categories(*)")
    .eq("id", id)
    .single();

  if (error) return fail(error.code === "PGRST116" ? "Ledger not found" : error.message, error.code === "PGRST116" ? 404 : 500);
  return ok(data);
}

export async function PATCH(request: Request, { params }: RouteProps) {
  const { supabase, response, user } = await requireUser();
  if (response) return response;
  const { id } = await params;

  const parsed = updateLedgerSchema.safeParse(await request.json());
  if (!parsed.success) return fail(parsed.error.flatten().formErrors.join(", ") || "Invalid payload", 422);

  const { data, error } = await supabase
    .from("ledgers")
    .update({
      ...parsed.data,
      currency: parsed.data.currency?.toUpperCase(),
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

  const { error } = await supabase.from("ledgers").delete().eq("id", id);
  if (error) return fail(error.message);
  return ok({ success: true });
}

import { fail, ok } from "@/lib/utils/api";
import { requireUser } from "@/lib/utils/auth";

interface RouteProps {
  params: Promise<{ id: string; uid: string }>;
}

export async function DELETE(_: Request, { params }: RouteProps) {
  const { supabase, response, user } = await requireUser();
  if (response) return response;
  const { id, uid } = await params;

  const { data: ledger, error: ledgerError } = await supabase.from("ledgers").select("owner_id").eq("id", id).single();
  if (ledgerError || !ledger) return fail(ledgerError?.message ?? "Ledger not found", ledgerError?.code === "PGRST116" ? 404 : 500);
  if (ledger.owner_id === uid) return fail("Owner cannot be removed", 422);

  const { error } = await supabase.from("ledger_members").delete().eq("ledger_id", id).eq("user_id", uid);
  if (error) return fail(error.message);
  return ok({ success: true });
}

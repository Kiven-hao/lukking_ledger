import { z } from "zod";
import { ok, fail } from "@/lib/utils/api";
import { requireUser } from "@/lib/utils/auth";
import { createLedgerSchema } from "@/lib/validations/ledger";

export async function GET() {
  const { supabase, response, user } = await requireUser();
  if (response) return response;

  const { data, error } = await supabase
    .from("ledger_members")
    .select("role, joined_at, ledger:ledgers(*)")
    .eq("user_id", user.id)
    .order("joined_at", { ascending: false });

  if (error) return fail(error.message);
  return ok(data);
}

export async function POST(request: Request) {
  const { supabase, response, user } = await requireUser();
  if (response) return response;

  const parsed = createLedgerSchema.safeParse(await request.json());
  if (!parsed.success) return fail(parsed.error.flatten().formErrors.join(", ") || "Invalid payload", 422);

  const payload = parsed.data;
  const ledgerId = crypto.randomUUID();

  const { error: ledgerError } = await supabase
    .from("ledgers")
    .insert({
      id: ledgerId,
      name: payload.name,
      description: payload.description ?? null,
      icon: payload.icon ?? "book",
      currency: payload.currency.toUpperCase(),
      owner_id: user.id,
    });

  if (ledgerError) return fail(ledgerError.message ?? "Failed to create ledger");

  const { error: memberError } = await supabase.from("ledger_members").insert({
    ledger_id: ledgerId,
    user_id: user.id,
    role: "owner",
  });

  if (memberError) return fail(memberError.message);
  return ok(
    {
      id: ledgerId,
      name: payload.name,
      description: payload.description ?? null,
      icon: payload.icon ?? "book",
      currency: payload.currency.toUpperCase(),
      owner_id: user.id,
    },
    { status: 201 },
  );
}

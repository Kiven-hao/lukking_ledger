import { fail, ok } from "@/lib/utils/api";
import { requireUser } from "@/lib/utils/auth";
import { acceptInviteSchema } from "@/lib/validations/ledger";

export async function POST(request: Request) {
  const { supabase, response, user } = await requireUser();
  if (response) return response;

  const parsed = acceptInviteSchema.safeParse(await request.json());
  if (!parsed.success) return fail(parsed.error.flatten().formErrors.join(", ") || "Invalid payload", 422);

  const { data: invite, error: inviteError } = await supabase
    .from("ledger_invites")
    .select("*")
    .eq("token", parsed.data.token)
    .single();

  if (inviteError || !invite) return fail("Invite not found", 404);

  const now = new Date();
  if (invite.status !== "active") return fail("Invite is no longer active", 422);
  if (new Date(invite.expires_at).getTime() < now.getTime()) {
    await supabase.from("ledger_invites").update({ status: "expired" }).eq("id", invite.id);
    return fail("Invite expired", 422);
  }

  const { data: existingMember } = await supabase
    .from("ledger_members")
    .select("id, role")
    .eq("ledger_id", invite.ledger_id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!existingMember) {
    const { error: memberError } = await supabase.from("ledger_members").insert({
      ledger_id: invite.ledger_id,
      user_id: user.id,
      role: invite.role,
    });

    if (memberError) return fail(memberError.message);
  }

  const { error: updateError } = await supabase
    .from("ledger_invites")
    .update({
      status: "used",
      used_by: user.id,
      used_at: now.toISOString(),
    })
    .eq("id", invite.id);

  if (updateError) return fail(updateError.message);
  return ok({ ledger_id: invite.ledger_id, role: existingMember?.role ?? invite.role });
}

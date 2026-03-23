import { fail, ok } from "@/lib/utils/api";
import { requireUser } from "@/lib/utils/auth";
import { createInviteSchema } from "@/lib/validations/ledger";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteProps) {
  const { supabase, response, user } = await requireUser();
  if (response) return response;
  const { id } = await params;

  const parsed = createInviteSchema.safeParse(await request.json());
  if (!parsed.success) return fail(parsed.error.flatten().formErrors.join(", ") || "Invalid payload", 422);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + parsed.data.expires_in_days);

  const { data, error } = await supabase
    .from("ledger_invites")
    .insert({
      ledger_id: id,
      role: parsed.data.role,
      created_by: user.id,
      expires_at: expiresAt.toISOString(),
    })
    .select()
    .single();

  if (error || !data) return fail(error?.message ?? "Failed to create invite");

  return ok(
    {
      ...data,
      invite_url: `/join?token=${data.token}`,
    },
    { status: 201 },
  );
}

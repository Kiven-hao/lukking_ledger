import { fail, ok } from "@/lib/utils/api";
import { requireUser } from "@/lib/utils/auth";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function GET(_: Request, { params }: RouteProps) {
  const { supabase, response, user } = await requireUser();
  if (response) return response;
  const { id } = await params;

  const { data, error } = await supabase
    .from("ledger_members")
    .select("id, role, joined_at, user_id, profile:profiles!ledger_members_user_id_fkey(id, nickname, avatar_url)")
    .eq("ledger_id", id)
    .order("joined_at", { ascending: true });

  if (error) return fail(error.message);
  return ok(data);
}

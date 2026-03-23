import type { User } from "@supabase/supabase-js";
import { fail } from "@/lib/utils/api";
import { createSupabaseServer } from "@/lib/supabase/server";

type AuthenticatedResult =
  | {
      supabase: Awaited<ReturnType<typeof createSupabaseServer>>;
      user: User;
      response: null;
    }
  | {
      supabase: Awaited<ReturnType<typeof createSupabaseServer>>;
      user: null;
      response: Response;
    };

export async function requireUser(): Promise<AuthenticatedResult> {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { supabase, user: null, response: fail("Unauthorized", 401) };
  }

  return { supabase, user, response: null };
}

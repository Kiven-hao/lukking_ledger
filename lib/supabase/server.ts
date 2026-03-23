import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";
import { getSupabaseEnv } from "@/lib/supabase/env";

type CookieToSet = {
  name: string;
  value: string;
  options?: Record<string, unknown>;
};

export async function createSupabaseServer() {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const authHeader = headerStore.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
  const { url, publishableKey } = getSupabaseEnv();

  return createServerClient(url, publishableKey, {
    global: bearerToken
      ? {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      : undefined,
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options as never);
          });
        } catch {
          // Server Components may call this during render; middleware will refresh sessions.
        }
      },
    },
  });
}

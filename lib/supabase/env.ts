export function getSupabaseEnv() {
  const env = getSupabaseEnvOptional();

  if (!env) {
    throw new Error("Missing Supabase environment variables.");
  }

  return env;
}

export function getSupabaseEnvOptional() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !publishableKey) {
    return null;
  }

  return { url, publishableKey };
}

export function getSupabaseServiceRoleKey() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY.");
  }

  return serviceRoleKey;
}

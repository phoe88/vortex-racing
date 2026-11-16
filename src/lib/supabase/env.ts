/** Public Supabase configuration (safe for the client bundle). */
export function getSupabasePublicEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return { url, anonKey };
}

/** True when the public Supabase credentials are present. */
export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabasePublicEnv();
  return Boolean(url && anonKey && url.startsWith("http"));
}

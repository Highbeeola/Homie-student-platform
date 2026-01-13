// lib/supabaseServer.ts
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  // USE THE SERVER-ONLY (NON-PUBLIC) VARIABLES
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Server environment variables SUPABASE_URL or SUPABASE_ANON_KEY are not set."
    );
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options?: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...(options as any) });
        } catch (e) {}
      },
      remove(name: string, _options?: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...(_options as any) });
        } catch (e) {}
      },
    },
  });
}

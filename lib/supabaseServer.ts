// lib/supabaseServer.ts
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  // --- START OF CRITICAL DEBUGGING ---
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  console.log("--- SERVER CLIENT DEBUG ---");
  console.log("Is SUPABASE_URL loaded?", !!supabaseUrl); // This will print true or false
  console.log("Is SUPABASE_ANON_KEY loaded?", !!supabaseAnonKey); // This will print true or false
  // If either of these is false, the .env.local file is not being read correctly.
  // --- END OF CRITICAL DEBUGGING ---

  if (!supabaseUrl || !supabaseAnonKey) {
    // If the keys are missing, we stop here to avoid the empty error.
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
        } catch (e) {
          // no-op
        }
      },
      remove(name: string, _options?: CookieOptions) {
        try {
          cookieStore.delete(name);
        } catch (e) {
          // no-op
        }
      },
    },
  });
}

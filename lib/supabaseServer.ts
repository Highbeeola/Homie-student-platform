// lib/supabaseServer.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (!url || !key) {
    throw new Error(
      "Supabase environment variables are not set. Please add SUPABASE_URL and SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_*) to your .env.local"
    );
  }

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        const all = cookieStore.getAll();
        return all.map((c) => ({ name: c.name, value: c.value }));
      },
    },
  });
}

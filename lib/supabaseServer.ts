// lib/supabaseServer.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      // Use the modern server cookie methods: provide getAll.
      // `setAll` is optional in many server-rendered components where
      // setting cookies isn't available; implement in middleware if needed.
      cookies: {
        getAll() {
          const all = cookieStore.getAll();
          return all.map((c) => ({ name: c.name, value: c.value }));
        },
      },
    }
  );
}
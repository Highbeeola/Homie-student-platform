// lib/supabaseServer.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Make the function itself async
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options?: CookieOptions) {
          try {
            // Adapt Next's cookie API to the expected shape
            cookieStore.set({ name, value, ...(options as any) });
          } catch (e) {
            // no-op in case cookies can't be set in this context
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
    }
  );
}
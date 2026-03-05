// components/Header.tsx
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import HeaderClient from "./HeaderClient"; // Import the client component

// This async Server Component fetches the data...
export async function Header() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ...and then passes it down to the Client Component to handle the display.
  return <HeaderClient user={user} />;
}

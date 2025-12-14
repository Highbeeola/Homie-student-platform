// components/UserNav.tsx
"use client"; // This must be a client component to handle the sign-out action

import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export function UserNav({ userEmail }: { userEmail: string }) {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/"); // Redirect to homepage
    router.refresh(); // Refresh the page to update the header
  };

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-300">{userEmail}</span>
      <button
        onClick={handleSignOut}
        className="rounded-full bg-red-500/20 px-4 py-2 text-sm font-semibold text-red-300 transition-colors hover:bg-red-500/40"
      >
        Sign Out
      </button>
    </div>
  );
}

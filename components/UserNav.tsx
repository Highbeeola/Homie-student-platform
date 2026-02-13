// components/UserNav.tsx
"use client";

import { createBrowserClient } from "@supabase/ssr"; // <-- THE FIX: Import from the new library
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserCircle } from "lucide-react";

export function UserNav({ userEmail }: { userEmail: string }) {
  const router = useRouter();

  // Create the client using the new, correct function
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    // We'll use a wrapper to group the items
    <div className="flex items-center gap-4">
      {/* We can remove the email and just have the links */}
      <Link
        href="/my-listings"
        className="text-base font-semibold tracking-wide text-white/90 hover:text-white transition-colors"
      >
        My Listings
      </Link>

      {/* Let's make the Profile link an icon for a cleaner look */}
      <Link href="/profile" className="text-gray-300 hover:text-white">
        <UserCircle size={24} />
      </Link>

      <button
        onClick={handleSignOut}
        className="rounded-full bg-red-500/20 px-4 py-2 text-sm font-semibold text-red-300 transition-colors hover:bg-red-500/40"
      >
        Sign Out
      </button>
    </div>
  );
}

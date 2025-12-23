"use client";

import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link"; // 1. IMPORT LINK

export function UserNav({ userEmail }: { userEmail: string }) {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-300">{userEmail}</span>

      {/* 2. ADD THE NEW "MY LISTINGS" LINK HERE */}
      <Link
        href="/my-listings"
        className="rounded-full px-3 py-1.5 text-sm font-semibold text-[#e6f9ff] transition-all hover:bg-white/10"
      >
        My Listings
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

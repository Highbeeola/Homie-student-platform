// components/UserNav.tsx
"use client";

// Note: You might need to change this import if you've fully upgraded
import { createBrowserClient } from "@supabase/auth-helpers-nextjs";

import { useRouter } from "next/navigation";
import Link from "next/link";

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
      {/* 1. User's Email */}
      <span className="text-sm text-gray-300 hidden sm:block">{userEmail}</span>

      {/* 2. "My Listings" Link */}
      <Link
        href="/my-listings"
        className="rounded-full px-3 py-1.5 text-sm font-semibold text-[#e6f9ff] transition-all hover:bg-white/10"
      >
        My Listings
      </Link>

      {/* 3. "Profile" Link */}
      <Link
        href="/profile"
        className="rounded-full px-3 py-1.5 text-sm font-semibold text-[#e6f9ff] transition-all hover:bg-white/10"
      >
        Profile
      </Link>

      {/* 4. "Sign Out" Button */}
      <button
        onClick={handleSignOut}
        className="rounded-full bg-red-500/20 px-4 py-2 text-sm font-semibold text-red-300 transition-colors hover:bg-red-500/40"
      >
        Sign Out
      </button>
    </div>
  );
}

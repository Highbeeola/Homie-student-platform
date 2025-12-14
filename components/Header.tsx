// components/Header.tsx

import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabaseServer"; // Import our server client
import { UserNav } from "./UserNav"; // Import the new component

// The Header is now an async Server Component!
export async function Header() {
  const supabase = await createSupabaseServerClient();

  // Get the current user's session data
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <header className="flex items-center justify-between py-3">
      {/* Brand Logo and Name */}
      <Link href="/" className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-[#00d4ff] to-[#8A6CFF] text-lg font-extrabold text-[#041322] shadow-lg">
          H
        </div>
        <div>
          <h1 className="text-lg font-extrabold tracking-wide">Homie</h1>
          <div className="text-xs text-[#bcdff0]">
            Students helping students
          </div>
        </div>
      </Link>

      {/* Navigation Links - Now with conditional logic */}
      <nav aria-label="main" className="flex items-center gap-4">
        <Link
          href="/add-listing"
          className="rounded-full px-3 py-1.5 font-semibold text-[#e6f9ff] transition-all hover:bg-white/10"
        >
          Add Listing
        </Link>

        {/* This is the magic: */}
        {session ? (
          // If a user session exists, show the UserNav component
          <UserNav userEmail={session.user.email!} />
        ) : (
          // Otherwise, show the Sign In button
          <Link
            href="/auth"
            className="rounded-full bg-white/10 px-4 py-2 font-semibold text-[#e6f9ff] transition-all hover:bg-white/20"
          >
            Sign In / Sign Up
          </Link>
        )}
      </nav>
    </header>
  );
}

// components/HeaderClient.tsx
"use client";

import Link from "next/link";
import { UserNav } from "./UserNav"; // Make sure UserNav is in the same folder
import type { Session } from "@supabase/supabase-js";

// This component's only job is to RENDER the UI based on the session it receives
export default function HeaderClient({ session }: { session: Session | null }) {
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

      {/* Navigation Links - Now with the conditional logic */}
      <nav aria-label="main" className="flex items-center gap-4">
        <Link
          href="/add-listing"
          className="rounded-full px-3 py-1.5 font-semibold text-[#e6f9ff] transition-all hover:bg-white/10"
        >
          Add Listing
        </Link>

        {/* This is the magic from your original Header.tsx */}
        {session ? (
          // If a session exists, show the UserNav component
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

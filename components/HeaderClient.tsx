// components/HeaderClient.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { UserNav } from "./UserNav";
import type { Session } from "@supabase/supabase-js";
import { Menu, X } from "lucide-react";

export default function HeaderClient({ session }: { session: Session | null }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to close the menu, useful for link clicks
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="relative flex items-center justify-between py-4">
      {/* Brand Logo */}
      <Link href="/" className="flex items-center gap-4" onClick={closeMenu}>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-[#00d4ff] to-[#8A6CFF] text-lg font-extrabold text-[#041322] shadow-lg">
          H
        </div>
        <div>
          <h1 className="text-lg font-extrabold tracking-wide text-white">
            Homie
          </h1>
          <div className="text-xs text-[#bcdff0]">
            Students helping students
          </div>
        </div>
      </Link>

      {/* Desktop Navigation (Hidden on small screens) */}
      <nav className="hidden md:flex items-center gap-6">
        <Link
          href="/browse"
          className="font-semibold text-[#e6f9ff] transition-colors hover:text-white"
        >
          Browse Spaces
        </Link>
        <Link
          href="/add-listing"
          className="font-semibold text-[#e6f9ff] transition-colors hover:text-white"
        >
          List a Space
        </Link>
        {session ? (
          <UserNav userEmail={session.user.email!} />
        ) : (
          <Link
            href="/auth"
            className="rounded-full bg-white/10 px-4 py-2 font-semibold text-[#e6f9ff] transition-colors hover:bg-white/20"
          >
            Sign In / Sign Up
          </Link>
        )}
      </nav>

      {/* Hamburger Button (Only visible on small screens) */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-md text-white hover:bg-white/10"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 w-full md:hidden bg-[#041322] border-t border-b border-white/10 shadow-xl z-50">
          <nav className="flex flex-col p-4">
            <Link
              href="/browse"
              className="px-4 py-3 rounded-md text-lg font-semibold hover:bg-white/10"
              onClick={closeMenu}
            >
              Browse Spaces
            </Link>
            <Link
              href="/add-listing"
              className="px-4 py-3 rounded-md text-lg font-semibold hover:bg-white/10"
              onClick={closeMenu}
            >
              List a Space
            </Link>

            <hr className="border-white/10 my-2" />

            {session ? (
              <>
                <Link
                  href="/my-listings"
                  className="px-4 py-3 rounded-md text-lg font-semibold hover:bg-white/10"
                  onClick={closeMenu}
                >
                  My Listings
                </Link>
                <Link
                  href="/profile"
                  className="px-4 py-3 rounded-md text-lg font-semibold hover:bg-white/10"
                  onClick={closeMenu}
                >
                  Profile
                </Link>
                <div className="mt-2">
                  <UserNav userEmail={session.user.email!} />
                </div>
              </>
            ) : (
              <Link
                href="/auth"
                className="px-4 py-3 rounded-md text-lg font-semibold bg-white/10 hover:bg-white/20"
                onClick={closeMenu}
              >
                Sign In / Sign Up
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

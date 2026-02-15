"use client";

import { useState } from "react";
import Link from "next/link";
import { UserNav } from "./UserNav";
import type { Session } from "@supabase/supabase-js";
import { Menu, X, ShieldAlert } from "lucide-react";

export default function HeaderClient({ session }: { session: Session | null }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  const ADMIN_EMAILS = [
    "ibrahimoladehinde1@gmail.com",
    "monsuratoladehinde69@gmail.com",
  ];

  const isAdmin = ADMIN_EMAILS.includes(session?.user?.email ?? "");

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

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-6">
        {isAdmin && (
          <Link
            href="/admin"
            className="font-semibold text-[#00d4ff] flex items-center gap-2"
          >
            <ShieldAlert size={18} />
            Admin
          </Link>
        )}

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

      {/* Hamburger */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-md text-white hover:bg-white/10 transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Fullscreen Menu */}
      {isMenuOpen && (
        <div className="absolute left-0 top-16 z-50 h-[calc(100vh-64px)] w-full bg-[#041322] px-6 py-8 md:hidden">
          <nav className="flex flex-col space-y-6">
            {isAdmin && (
              <Link
                href="/admin"
                onClick={closeMenu}
                className="text-lg font-bold text-[#00d4ff] flex items-center gap-2"
              >
                <ShieldAlert size={20} />
                Admin Portal
              </Link>
            )}

            <Link
              href="/browse"
              onClick={closeMenu}
              className="text-lg font-bold text-white hover:text-[#00d4ff]"
            >
              Browse Spaces
            </Link>

            <Link
              href="/add-listing"
              onClick={closeMenu}
              className="text-lg font-bold text-white hover:text-[#00d4ff]"
            >
              List a Space
            </Link>

            {session && (
              <>
                <Link
                  href="/my-listings"
                  onClick={closeMenu}
                  className="text-lg font-bold text-white hover:text-[#00d4ff]"
                >
                  My Listings
                </Link>

                <Link
                  href="/profile"
                  onClick={closeMenu}
                  className="text-lg font-bold text-white hover:text-[#00d4ff]"
                >
                  Profile
                </Link>
              </>
            )}
          </nav>

          <div className="mt-12 border-t border-white/10 pt-8">
            {session ? (
              <UserNav userEmail={session.user.email!} />
            ) : (
              <div className="flex flex-col gap-3">
                <p className="text-sm text-gray-400 mb-2">Join the community</p>
                <Link
                  href="/auth"
                  onClick={closeMenu}
                  className="w-full rounded-lg bg-[#00d4ff] py-3 text-center font-bold text-[#041322]"
                >
                  Log In
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

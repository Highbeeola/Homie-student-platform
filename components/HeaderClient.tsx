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
          className="text-sm font-bold text-white hover:text-[#00d4ff]"
        >
          Browse
        </Link>

        {session && (
          <Link
            href="/my-bookings"
            className="text-sm font-bold text-white hover:text-[#00d4ff]"
          >
            My Bookings
          </Link>
        )}

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

      {/* Fullscreen Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#041322]/95 backdrop-blur-md transition-all duration-300 md:hidden">
          {/* Header inside Menu */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#00d4ff] to-blue-600" />
              <span className="text-xl font-bold tracking-tight text-white">
                Homie
              </span>
            </div>
            <button
              onClick={closeMenu}
              className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 flex flex-col justify-center px-8 space-y-6">
            {isAdmin && (
              <Link
                href="/admin"
                onClick={closeMenu}
                className="text-2xl font-bold text-[#00d4ff] flex items-center gap-2"
              >
                <ShieldAlert size={22} />
                Admin Portal
              </Link>
            )}

            <Link
              href="/browse"
              onClick={closeMenu}
              className="text-2xl font-bold text-white hover:text-[#00d4ff] transition-colors"
            >
              Browse Spaces
            </Link>

            {session && (
              <Link
                href="/my-bookings"
                onClick={closeMenu}
                className="text-2xl font-bold text-white hover:text-[#00d4ff] transition-colors"
              >
                My Bookings
              </Link>
            )}

            <Link
              href="/add-listing"
              onClick={closeMenu}
              className="text-2xl font-bold text-white hover:text-[#00d4ff] transition-colors"
            >
              List a Space
            </Link>

            {session && (
              <Link
                href="/my-listings"
                onClick={closeMenu}
                className="text-2xl font-bold text-white hover:text-[#00d4ff] transition-colors"
              >
                My Listings
              </Link>
            )}
          </nav>

          {/* Footer Section */}
          <div className="p-8 border-t border-white/10 bg-black/20">
            {session ? (
              <UserNav userEmail={session.user.email!} />
            ) : (
              <div className="text-center">
                <p className="text-gray-400 mb-4">
                  Join the student community
                </p>
                <Link
                  href="/auth"
                  onClick={closeMenu}
                  className="block w-full rounded-xl bg-[#00d4ff] py-4 font-bold text-[#041322] shadow-lg hover:opacity-90"
                >
                  Log In / Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

"use client";

import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { LogOut, User as UserIcon } from "lucide-react";
import type { User } from "@supabase/supabase-js";

export default function HeaderClient({ user }: { user: User | null }) {
  const router = useRouter();

  // Replace with your actual admin emails
  const isAdmin = ["your-email@gmail.com", "cofounder@gmail.com"].includes(
    user?.email || "",
  );

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const handleSignOut = async () => {
    const confirmed = window.confirm("Are you sure you want to sign out?");
    if (!confirmed) return;

    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#041322]/95 backdrop-blur-md">
      {/* ========================================= */}
      {/* 🖥️ DESKTOP HEADER (Hidden on Mobile) */}
      {/* ========================================= */}
      <div className="hidden md:flex mx-auto h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* --- LOGO --- */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-[#00d4ff] to-[#8A6CFF] text-xl font-extrabold text-[#041322] shadow-lg group-hover:scale-105 transition-transform">
            H
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white leading-none">
              Homie
            </span>
            <span className="text-[10px] text-gray-400 font-medium">
              Students helping students
            </span>
          </div>
        </Link>

        {/* --- DESKTOP NAV --- */}
        <nav className="flex items-center gap-6">
          {isAdmin && (
            <Link
              href="/admin"
              className="text-sm font-bold text-[#00d4ff] hover:text-white transition-colors flex items-center gap-1"
            >
              <span className="bg-[#00d4ff]/10 px-2 py-1 rounded">Admin</span>
            </Link>
          )}

          <Link
            href="/browse"
            className="text-sm font-bold text-gray-300 hover:text-[#00d4ff] transition-colors"
          >
            Browse
          </Link>

          {user && (
            <>
              <Link
                href="/my-bookings"
                className="text-sm font-bold text-gray-300 hover:text-[#00d4ff] transition-colors"
              >
                My Bookings
              </Link>
              <Link
                href="/my-listings"
                className="text-sm font-bold text-gray-300 hover:text-[#00d4ff] transition-colors"
              >
                My Spaces
              </Link>
              <Link
                href="/add-listing"
                className="text-sm font-bold text-gray-300 hover:text-[#00d4ff] transition-colors"
              >
                List a Space
              </Link>
            </>
          )}
        </nav>

        {/* --- DESKTOP USER ACTIONS --- */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="hover:opacity-80 transition-opacity"
              >
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#00d4ff] to-blue-600 flex items-center justify-center text-sm font-bold text-white border-2 border-[#041322]">
                  <UserIcon size={20} />
                </div>
              </Link>

              <button
                onClick={handleSignOut}
                className="rounded-lg bg-red-500/10 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-500 hover:text-white transition-all"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/auth?mode=signin"
              className="rounded-xl bg-[#00d4ff] px-6 py-2.5 text-sm font-bold text-[#041322] hover:opacity-90 transition-opacity shadow-lg shadow-[#00d4ff]/20"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* ========================================= */}
      {/* 📱 MOBILE HEADER (Hidden on Desktop) */}
      {/* ========================================= */}
      <div className="flex md:hidden flex-col">
        {/* Top Row: Logo & User Actions */}
        <div className="flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#00d4ff] to-[#8A6CFF] text-lg font-extrabold text-[#041322] shadow-lg">
              H
            </div>
            <span className="text-xl font-bold tracking-tight text-white leading-none">
              Homie
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="hover:opacity-80 transition-opacity"
                >
                  <div className="h-9 w-9 rounded-full bg-gradient-to-r from-[#00d4ff] to-blue-600 flex items-center justify-center text-sm font-bold text-white border-2 border-[#041322]">
                    <UserIcon size={16} />
                  </div>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="rounded-lg bg-red-500/10 p-2 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <Link
                href="/auth?mode=signin"
                className="rounded-xl bg-[#00d4ff] px-4 py-2 text-xs font-bold text-[#041322]"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Bottom Row: Horizontal Scroll Nav */}
        <nav className="flex items-center gap-6 overflow-x-auto px-4 py-3 hide-scrollbar text-sm font-bold text-gray-300 border-t border-white/10">
          {isAdmin && (
            <Link
              href="/admin"
              className="whitespace-nowrap text-[#00d4ff] hover:text-white transition-colors"
            >
              Admin
            </Link>
          )}

          <Link
            href="/browse"
            className="whitespace-nowrap hover:text-[#00d4ff] transition-colors"
          >
            Find a Room
          </Link>

          {user && (
            <>
              <Link
                href="/my-bookings"
                className="whitespace-nowrap hover:text-[#00d4ff] transition-colors"
              >
                My Bookings
              </Link>
              <Link
                href="/my-listings"
                className="whitespace-nowrap hover:text-[#00d4ff] transition-colors"
              >
                My Spaces
              </Link>
              <Link
                href="/add-listing"
                className="whitespace-nowrap text-[#00d4ff] hover:text-white transition-colors"
              >
                + List a Space
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

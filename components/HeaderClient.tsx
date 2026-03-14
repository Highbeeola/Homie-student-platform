"use client";

import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, User as UserIcon } from "lucide-react";
import type { User } from "@supabase/supabase-js";

export default function HeaderClient({ user }: { user: User | null }) {
  const router = useRouter();
  const pathname = usePathname();

  // Hide nav/actions on auth page
  const isAuthPage = pathname === "/auth";

  const isAdmin = [
    "ibrahimoladehinde1@gmail.com",
    "azeezoladipupofatoye@gmail.com",
  ].includes(user?.email || "");

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
      <div className="mx-auto hidden h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 md:flex">
        {/* --- LOGO (Always Visible) --- */}
        <Link href="/" className="group flex items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-[#00d4ff] to-[#8A6CFF] text-xl font-extrabold text-[#041322] shadow-lg transition-transform group-hover:scale-105">
            H
          </div>
          <div className="flex flex-col">
            <span className="leading-none text-xl font-bold tracking-tight text-white">
              Homie
            </span>
            <span className="text-[10px] font-medium text-gray-400">
              Students helping students
            </span>
          </div>
        </Link>

        {/* Hide nav/actions on auth page */}
        {!isAuthPage && (
          <>
            {/* --- DESKTOP NAV --- */}
            <nav className="flex items-center gap-6">
              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex items-center gap-1 text-sm font-bold text-[#00d4ff] transition-colors hover:text-white"
                >
                  <span className="rounded bg-[#00d4ff]/10 px-2 py-1">
                    Admin
                  </span>
                </Link>
              )}

              {/* Shown to EVERYONE */}
              <Link
                href="/browse"
                className="text-sm font-bold text-gray-300 transition-colors hover:text-[#00d4ff]"
              >
                Find a Room
              </Link>

              <Link
                href="/add-listing"
                className="text-sm font-bold text-gray-300 transition-colors hover:text-[#00d4ff]"
              >
                List a Space
              </Link>

              {/* Shown ONLY to LOGGED IN users */}
              {user && (
                <>
                  <Link
                    href="/saved-spaces"
                    className="text-sm font-bold text-gray-300 transition-colors hover:text-[#00d4ff]"
                  >
                    Saved Spaces
                  </Link>

                  <Link
                    href="/my-bookings"
                    className="text-sm font-bold text-gray-300 transition-colors hover:text-[#00d4ff]"
                  >
                    My Bookings
                  </Link>

                  <Link
                    href="/my-listings"
                    className="text-sm font-bold text-gray-300 transition-colors hover:text-[#00d4ff]"
                  >
                    My Spaces
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
                    className="transition-opacity hover:opacity-80"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#041322] bg-gradient-to-r from-[#00d4ff] to-blue-600 text-sm font-bold text-white">
                      <UserIcon size={20} />
                    </div>
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="rounded-lg bg-red-500/10 px-4 py-2 text-sm font-bold text-red-500 transition-all hover:bg-red-500 hover:text-white"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth?mode=signin"
                  className="rounded-xl bg-[#00d4ff] px-6 py-2.5 text-sm font-bold text-[#041322] shadow-lg shadow-[#00d4ff]/20 transition-opacity hover:opacity-90"
                >
                  Sign In
                </Link>
              )}
            </div>
          </>
        )}
      </div>

      {/* ========================================= */}
      {/* 📱 MOBILE HEADER (Hidden on Desktop) */}
      {/* ========================================= */}
      <div className="flex flex-col md:hidden">
        {/* Top Row: Logo & User Actions */}
        <div className="flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#00d4ff] to-[#8A6CFF] text-lg font-extrabold text-[#041322] shadow-lg">
              H
            </div>
            <span className="leading-none text-xl font-bold tracking-tight text-white">
              Homie
            </span>
          </Link>

          {!isAuthPage && (
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <Link
                    href="/profile"
                    className="transition-opacity hover:opacity-80"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#041322] bg-gradient-to-r from-[#00d4ff] to-blue-600 text-sm font-bold text-white">
                      <UserIcon size={16} />
                    </div>
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="rounded-lg bg-red-500/10 p-2 text-red-500 transition-all hover:bg-red-500 hover:text-white"
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
          )}
        </div>

        {/* Bottom Row: Horizontal Scroll Nav */}
        {!isAuthPage && (
          <nav className="hide-scrollbar flex items-center gap-6 overflow-x-auto border-t border-white/10 px-4 py-3 text-sm font-bold text-gray-300">
            {isAdmin && (
              <Link
                href="/admin"
                className="whitespace-nowrap text-[#00d4ff] transition-colors hover:text-white"
              >
                Admin
              </Link>
            )}

            {/* Shown to EVERYONE */}
            <Link
              href="/browse"
              className="whitespace-nowrap transition-colors hover:text-[#00d4ff]"
            >
              Find a Room
            </Link>

            <Link
              href="/add-listing"
              className="whitespace-nowrap text-[#00d4ff] transition-colors hover:text-white"
            >
              + List a Space
            </Link>

            {/* Shown ONLY to LOGGED IN users */}
            {user && (
              <>
                <Link
                  href="/saved-spaces"
                  className="whitespace-nowrap transition-colors hover:text-[#00d4ff]"
                >
                  Saved Spaces
                </Link>

                <Link
                  href="/my-bookings"
                  className="whitespace-nowrap transition-colors hover:text-[#00d4ff]"
                >
                  My Bookings
                </Link>

                <Link
                  href="/my-listings"
                  className="whitespace-nowrap transition-colors hover:text-[#00d4ff]"
                >
                  My Spaces
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}

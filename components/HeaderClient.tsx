"use client";

import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Menu,
  X,
  LogOut,
  MapPin,
  Home,
  List,
  User as UserIcon,
  PlusCircle,
} from "lucide-react";
import type { Session } from "@supabase/supabase-js";

export default function HeaderClient({ session }: { session: Session | null }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const user = session?.user;

  // Replace with your actual admin emails
  const isAdmin = ["your-email@gmail.com", "cofounder@gmail.com"].includes(
    user?.email || "",
  );

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#041322]/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* --- 1. LOGO --- */}
        <Link
          href="/"
          className="flex items-center gap-2 group"
          onClick={() => setIsMobileMenuOpen(false)}
        >
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

        {/* --- 2. DESKTOP NAV --- */}
        <nav className="hidden md:flex items-center gap-6">
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

              {/* ✅ ADDED BACK: My Listings */}
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

        {/* --- 3. DESKTOP USER ACTIONS --- */}
        <div className="hidden md:flex items-center gap-4">
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
              href="/auth"
              className="rounded-xl bg-[#00d4ff] px-6 py-2.5 text-sm font-bold text-[#041322] hover:opacity-90 transition-opacity shadow-lg shadow-[#00d4ff]/20"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* --- 4. MOBILE MENU BUTTON --- */}
        <button
          className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu size={32} />
        </button>
      </div>

      {/* --- 5. MOBILE MENU OVERLAY (Solid Background) --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-[#041322] flex flex-col h-screen w-screen animate-in slide-in-from-right duration-200">
          {/* Mobile Header */}
          <div className="flex items-center justify-between px-4 h-20 border-b border-white/10 bg-[#041322]">
            <span className="text-lg font-bold text-white">Menu</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-white bg-white/10 rounded-full"
            >
              <X size={24} />
            </button>
          </div>

          {/* Links Container */}
          <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
            <Link
              href="/browse"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-4 text-white hover:text-[#00d4ff]"
            >
              <MapPin size={24} className="text-[#00d4ff]" />
              <span className="text-2xl font-bold">Browse Spaces</span>
            </Link>

            {user && (
              <>
                <Link
                  href="/my-bookings"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-4 text-white hover:text-[#00d4ff]"
                >
                  <Home size={24} className="text-[#00d4ff]" />
                  <span className="text-2xl font-bold">My Bookings</span>
                </Link>
                <Link
                  href="/my-listings"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-4 text-white hover:text-[#00d4ff]"
                >
                  <List size={24} className="text-[#00d4ff]" />
                  <span className="text-2xl font-bold">My Spaces</span>
                </Link>
              </>
            )}

            <Link
              href="/add-listing"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-4 text-[#00d4ff]"
            >
              <PlusCircle size={24} />
              <span className="text-2xl font-bold">List a Space</span>
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-4 text-yellow-400 mt-6 pt-6 border-t border-white/10"
              >
                <span className="text-xl font-bold">Admin Portal</span>
              </Link>
            )}
          </div>

          {/* Footer User Section */}
          <div className="p-6 border-t border-white/10 bg-[#0B1D2E]">
            {user ? (
              <div className="flex items-center justify-between">
                <Link
                  href="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3"
                >
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#00d4ff] to-blue-600 flex items-center justify-center text-white font-bold border-2 border-[#041322]">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-white">My Profile</p>
                    <p className="text-xs text-gray-400 truncate max-w-[150px]">
                      {user.email}
                    </p>
                  </div>
                </Link>

                <button
                  onClick={handleSignOut}
                  className="flex flex-col items-center text-red-500 hover:text-red-400"
                >
                  <LogOut size={24} />
                  <span className="text-[10px] font-bold uppercase mt-1">
                    Sign Out
                  </span>
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full rounded-xl bg-[#00d4ff] py-4 text-center font-bold text-[#041322] shadow-lg"
              >
                Log In / Sign Up
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

// src/components/Header.tsx

import Link from "next/link";

// The word "export" right here is the most important part.
// Make sure it exists in your file.
export function Header() {
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

      {/* Navigation Links */}
      <nav aria-label="main" className="flex items-center gap-2">
        <Link
          href="/add-listing"
          className="rounded-full px-3 py-1.5 font-semibold text-[#e6f9ff] transition-all hover:bg-white/10"
        >
          Add Listing
        </Link>
        <Link
          href="/auth" // <-- Changed this href
          className="rounded-full bg-white/10 px-4 py-2 font-semibold text-[#e6f9ff] transition-all hover:bg-white/20"
        >
          Sign In / Sign Up
        </Link>
      </nav>
    </header>
  );
}

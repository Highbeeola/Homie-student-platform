// components/Hero.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";

export function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/browse");
    }
  };

  return (
    <section className="text-center py-16 lg:py-24 rounded-2xl bg-gradient-to-tr from-blue-900/40 via-transparent to-transparent">
      <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold text-white tracking-tight">
        Student Housing, <br />
        Made <span className="text-[#00d4ff]">Simple & Safe</span>
      </h1>

      <p className="mt-4 text-base sm:text-lg lg:text-xl text-blue-200 max-w-2xl mx-auto">
        Nigeria's peer-to-peer marketplace for student accommodation. Connect
        directly with students and skip the agent chaos.
      </p>

      <form
        onSubmit={handleSearch}
        className="mt-8 mx-auto max-w-xl w-full flex items-center p-2 rounded-full bg-white/5 border border-white/20 backdrop-blur-sm"
      >
        <div className="flex-shrink-0 pl-4">
          <Search className="w-5 h-5 sm:w-6 sm:h-6 text-blue-300" />
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a location or campus..."
          aria-label="Search listings"
          className="w-full bg-transparent text-white placeholder-blue-300 text-sm sm:text-base lg:text-lg px-4 py-2 outline-none border-none"
        />

        <button
          type="submit"
          disabled={!searchQuery.trim()}
          className={`rounded-full px-6 sm:px-8 py-2 sm:py-3 font-bold text-sm sm:text-base transition-all duration-200
          ${
            searchQuery.trim()
              ? "bg-gradient-to-r from-[#00d4ff] to-[#8A6CFF] text-[#041322] hover:scale-105"
              : "bg-gray-600 text-gray-300 cursor-not-allowed"
          }`}
        >
          Find a Home
        </button>
      </form>

      <p className="mt-6 text-blue-200 text-sm sm:text-base">
        Leaving your space?{" "}
        <Link
          href="/add-listing"
          className="font-semibold text-white hover:underline"
        >
          List it for free
        </Link>
      </p>
    </section>
  );
}

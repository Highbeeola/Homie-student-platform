"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import Link from "next/link";

export function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Send them to the browse page with the location filter applied!
      router.push(`/browse?location=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push(`/browse`);
    }
  };

  return (
    <section className="relative flex flex-col items-center justify-center pt-20 pb-16 text-center">
      {/* Glow Effect */}
      <div className="absolute top-10 h-[300px] w-[300px] rounded-full bg-[#00d4ff]/20 blur-[100px]" />

      <h1 className="relative z-10 mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-white sm:text-7xl">
        Student Housing, <br />
        Made{" "}
        <span className="bg-gradient-to-r from-[#00d4ff] to-[#8A6CFF] bg-clip-text text-transparent">
          Simple & Safe
        </span>
      </h1>

      <p className="relative z-10 mt-6 max-w-2xl text-lg text-gray-400 sm:text-xl mx-auto">
        Nigeria's peer-to-peer marketplace for student accommodation. Connect
        directly with students and skip the agent chaos.
      </p>

      {/* ✅ FUNCTIONAL SEARCH BAR */}
      <form
        onSubmit={handleSearch}
        className="relative z-10 mt-10 flex w-full max-w-2xl flex-col sm:flex-row items-center gap-2 rounded-2xl bg-white/5 p-2 border border-white/10 backdrop-blur-md mx-auto"
      >
        <div className="flex w-full flex-1 items-center gap-3 px-4 py-2">
          <Search size={20} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search for a location or campus (e.g., Yaba, UNILAG)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-white outline-none placeholder:text-gray-500"
          />
        </div>
        <button
          type="submit"
          className="w-full sm:w-auto rounded-xl bg-[#00d4ff] px-8 py-3 font-bold text-[#041322] hover:opacity-90 transition-opacity"
        >
          Find a Home
        </button>
      </form>

      <p className="mt-6 text-sm text-gray-400 relative z-10">
        Leaving your space?{" "}
        <Link
          href="/add-listing"
          className="text-white font-bold hover:underline"
        >
          List it for free
        </Link>
      </p>
    </section>
  );
}

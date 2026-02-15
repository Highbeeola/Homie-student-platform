"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, Filter } from "lucide-react";

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Initialize state from URL params
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [roomType, setRoomType] = useState(searchParams.get("roomType") || "");

  const handleSearch = () => {
    startTransition(() => {
      const params = new URLSearchParams();
      if (location) params.set("location", location);
      if (maxPrice) params.set("maxPrice", maxPrice);
      if (roomType) params.set("roomType", roomType);

      router.push(`/browse?${params.toString()}`);
    });
  };

  return (
    <div className="mb-8 rounded-2xl border border-white/10 bg-[#0B1D2E] p-4 md:p-6 shadow-xl">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {/* Location Input */}
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search location (e.g. Yaba, Akoka)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full rounded-xl bg-black/30 border border-white/10 py-3 pl-10 pr-4 text-white focus:border-[#00d4ff] outline-none"
          />
        </div>

        {/* Max Price Input */}
        <div>
          <input
            type="number"
            placeholder="Max Price (₦)"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full rounded-xl bg-black/30 border border-white/10 py-3 px-4 text-white focus:border-[#00d4ff] outline-none"
          />
        </div>

        {/* Room Type Select */}
        <div>
          <select
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            className="w-full rounded-xl bg-black/30 border border-white/10 py-3 px-4 text-white focus:border-[#00d4ff] outline-none appearance-none"
          >
            <option value="">Any Room Type</option>
            <option value="1">1 Room / Self Con</option>
            <option value="2">2 Rooms</option>
            <option value="Shared">Shared / Bedspace</option>
          </select>
        </div>
      </div>

      {/* Apply Button */}
      <button
        onClick={handleSearch}
        disabled={isPending}
        className="mt-4 w-full rounded-xl bg-[#00d4ff] py-3 font-bold text-[#041322] hover:opacity-90 transition-opacity flex justify-center items-center gap-2"
      >
        {isPending ? (
          "Filtering..."
        ) : (
          <>
            <Filter size={18} /> Apply Filters
          </>
        )}
      </button>
    </div>
  );
}

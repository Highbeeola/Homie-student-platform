"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { ListingCard } from "@/components/ListingCard";
import type { Listing } from "@/types/listing";
import Link from "next/link";
import { BookmarkX } from "lucide-react";

export default function SavedSpacesPage() {
  const [savedListings, setSavedListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  useEffect(() => {
    const fetchSavedListings = async () => {
      // 1. Get IDs from Local Storage
      const savedIds = JSON.parse(localStorage.getItem("homie_saved") || "[]");

      if (savedIds.length === 0) {
        setLoading(false);
        return;
      }

      // 2. Fetch those specific listings from Supabase
      const { data, error } = await supabase
        .from("listings")
        .select("*, profiles!listings_user_id_fkey(verification_status)")
        .in("id", savedIds);

      if (!error && data) {
        setSavedListings(data);
      }
      setLoading(false);
    };

    fetchSavedListings();
  }, [supabase]);

  return (
    <div className="min-h-screen bg-[#041322] px-4 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-2 text-3xl font-bold">Saved Spaces</h1>
        <p className="mb-8 text-gray-400">
          Places you have bookmarked for later.
        </p>

        {loading ? (
          <div className="text-center text-gray-500 py-20 animate-pulse">
            Loading saved spaces...
          </div>
        ) : savedListings.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {savedListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="mt-20 flex flex-col items-center text-center">
            <div className="bg-white/5 p-6 rounded-full mb-4">
              <BookmarkX size={48} className="text-gray-500" />
            </div>
            <p className="text-xl font-bold text-white mb-2">
              No saved spaces yet.
            </p>
            <p className="text-gray-400 mb-6">
              Click the Save button on a listing to keep track of your
              favorites.
            </p>
            <Link
              href="/browse"
              className="rounded-xl bg-[#00d4ff] px-6 py-3 font-bold text-[#041322] hover:opacity-90"
            >
              Start Browsing
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// app/my-listings/page.tsx

import { Header } from "@/components/Header";
import { ListingCard } from "@/components/ListingCard";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import type { Listing } from "@/types/listing";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function MyListingsPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth");
  }

  const { data: listings, error } = await supabase
    .from("listings")
    .select<"*", Listing>("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user's listings:", error);
  }

  // --- THIS IS THE CRITICAL DEBUGGING STEP ---
  console.log("DATA FETCHED FOR MY LISTINGS PAGE:", listings);
  // ---------------------------------------------

  const hasListings = listings && listings.length > 0;

  return (
    // ... your JSX is perfect, no changes needed ...
    <div className="min-h-screen bg-[#001428] text-[#e6f9ff]">
      <div className="mx-auto max-w-6xl px-4 pb-16">
        <Header />
        <div className="mt-12">
          <h1 className="text-3xl font-bold">My Listings</h1>
          <p className="mt-2 text-[#bcdff0]">
            Manage your active and pending accommodation listings.
          </p>
        </div>
        {hasListings ? (
          <section className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                showManagementControls={true} // keep or remove depending on your need
              />
            ))}
          </section>
        ) : (
          <div className="mt-8 rounded-lg border border-dashed border-white/20 bg-white/5 p-8 text-center text-[#bcdff0]">
            <h3 className="text-lg font-bold">
              You haven't added any listings yet.
            </h3>
            <p className="mt-2">
              Why not help a fellow student find their next home?
            </p>
            <Link
              href="/add-listing"
              className="mt-6 inline-block rounded-lg bg-gradient-to-r from-[#00d4ff] to-[#8A6CFF] px-6 py-3 font-bold text-[#041322]"
            >
              Add Your First Listing
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

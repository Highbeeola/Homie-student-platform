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
    // Supabase/PostgREST error objects may expose data on the prototype
    // or via symbols/non-enumerable properties. Log a rich set of
    // diagnostics so the cause is visible in the server logs.
    try {
      const details: Record<string, any> = {
        typeof: typeof error,
        isErrorInstance: error instanceof Error,
        message: (error as any)?.message,
        name: (error as any)?.name,
        keys: Object.keys(error),
        ownPropertyNames: Object.getOwnPropertyNames(error),
        ownPropertySymbols: Object.getOwnPropertySymbols
          ? Object.getOwnPropertySymbols(error).map((s) => s.toString())
          : [],
        descriptors: Object.getOwnPropertyDescriptors(error),
        prototypeConstructor:
          Object.getPrototypeOf(error)?.constructor?.name,
      };

      console.error("Error fetching user's listings (details):", details);
      // Also print the raw object (may still appear as {} in some loggers)
      console.error("Error fetching user's listings (raw):", error);
    } catch (serializeErr) {
      console.error(
        "Error serializing Supabase error:",
        serializeErr,
        "original:",
        error
      );
    }
  }

  const hasListings = listings && listings.length > 0;

  return (
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
          <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              // THIS IS THE ONLY CHANGE NEEDED IN THIS FILE
              <ListingCard
                key={listing.id}
                listing={listing}
                showManagementControls={true} // <-- Pass the prop here
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

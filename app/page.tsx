// app/page.tsx

import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ListingCard } from "@/components/ListingCard";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import type { Listing } from "@/types/listing";

export default async function HomePage() {
  // 2. AWAIT THE CLIENT: We add the 'await' keyword here.
  const supabase = await createSupabaseServerClient();
  // Fetch listings with safer handling so server logs don't trigger Next overlay
  let listings: Listing[] | null = null;
  let fetchError: any = null;

  try {
    const res = await supabase
      .from("listings")
      .select<"*", Listing>("*")
      .order("created_at", { ascending: false });

    listings = res.data || null;

    if (res.error) {
      // Use warn so Next's overlay doesn't treat this as an internal server error
      console.warn("Error fetching listings (Supabase):", res.error);
      fetchError = {
        message: (res.error as any)?.message ?? null,
        code: (res.error as any)?.code ?? null,
      };
    }
  } catch (e) {
    console.warn("Unexpected error fetching listings:", e);
    fetchError = e;
  }

  const hasListings = !!(listings && listings.length > 0);

  return (
    <div className="min-h-screen bg-[#001428] text-[#e6f9ff]">
      <div className="mx-auto max-w-6xl px-4 pb-16">
        <Header />
        <Hero />

        <div className="mt-12 flex items-center justify-between">
          <h3 className="font-bold text-[#bcdff0]">Recommended homes</h3>
          <div className="text-sm text-[#bcdff0]">
            {listings?.length || 0} listings
          </div>
        </div>

        {fetchError && (
          <div className="mt-6 rounded-md bg-yellow-900/40 border border-yellow-500 p-4 text-yellow-100">
            <strong>Could not load listings.</strong>
            <div className="text-sm mt-1">
              {typeof fetchError === "string"
                ? fetchError
                : fetchError?.message ?? "Check server logs for details."}
            </div>
          </div>
        )}

        {hasListings ? (
          <section className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* 3. The 'any' error is now gone because TypeScript knows what 'listing' is. */}
            {listings!.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </section>
        ) : (
          <div className="mt-6 rounded-lg border border-dashed border-white/20 bg-white/5 p-8 text-center text-[#bcdff0]">
            <h3 className="text-lg font-bold">No listings yet!</h3>
            <p>Be the first to add a listing and help a fellow student.</p>
          </div>
        )}
      </div>
    </div>
  );
}

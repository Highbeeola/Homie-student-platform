// app/page.tsx

import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ListingCard } from "@/components/ListingCard";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();
  const { data: listings, error } = await supabase
    .from("listings")
    .select("*")
    .order("id", { ascending: false });

  if (error) console.error("Error fetching listings:", error);

  const hasListings = listings && listings.length > 0;

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

        {hasListings ? (
          <section className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing} // We ONLY pass the listing data now
              />
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

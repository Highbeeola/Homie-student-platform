// app/browse/page.tsx
import { Header } from "@/components/Header";
import { ListingCard } from "@/components/ListingCard";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import type { Listing } from "@/types/listing";

export default async function BrowsePage() {
  const supabase = await createSupabaseServerClient();
  const { data: listings, error } = await supabase
    .from("listings")
    .select<"*", Listing>("*")
    .order("created_at", { ascending: false });

  if (error) {
    return <p>Error loading listings.</p>;
  }

  return (
    <div className="min-h-screen bg-[#001428] text-[#e6f9ff]">
      <div className="mx-auto max-w-6xl px-4 pb-16">
        <Header />
        <div className="mt-8">
          <h1 className="text-3xl font-bold">Browse All Spaces</h1>
          <p className="text-lg text-gray-300">
            Find your perfect student home.
          </p>
        </div>
        <div className="mt-8">
          {listings && listings.length > 0 ? (
            <section className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </section>
          ) : (
            <div className="mt-8 text-center text-gray-400">
              <h3 className="text-xl font-bold">
                No listings have been posted yet.
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

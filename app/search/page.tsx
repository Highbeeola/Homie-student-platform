// app/search/page.tsx
import { Header } from "@/components/Header";
import { ListingCard } from "@/components/ListingCard";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import type { Listing } from "@/types/listing";
import { Suspense } from "react";

// This is the inner component that does the actual work
async function SearchResults({ query }: { query: string }) {
  const supabase = await createSupabaseServerClient();

  if (!query) {
    return (
      <div className="mt-8 text-center text-gray-400">
        <h3 className="text-xl font-bold">Please enter a search term.</h3>
      </div>
    );
  }

  // Use the reliable .or() filter for a simple, effective search
  const { data: listings, error } = await supabase
    .from("listings")
    .select<"*", Listing>("*")
    .or(`title.ilike.%${query}%,location.ilike.%${query}%`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Search error:", error);
    return (
      <p className="text-center text-red-400 mt-8">
        Error loading search results.
      </p>
    );
  }

  return (
    <div>
      {listings && listings.length > 0 ? (
        <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </section>
      ) : (
        <div className="mt-8 text-center text-gray-400">
          <h3 className="text-xl font-bold">No results found for "{query}"</h3>
          <p>Try searching for a different location or keyword.</p>
        </div>
      )}
    </div>
  );
}

// This is the main page component. It is now ASYNC.
export default async function SearchPage({
  searchParams,
}: {
  // We type searchParams as a Promise
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // THE FIX: We await the promise to get the real object
  const resolvedSearchParams = await searchParams;
  const searchQuery = Array.isArray(resolvedSearchParams?.q)
    ? resolvedSearchParams.q[0]
    : resolvedSearchParams?.q || "";

  return (
    <div className="min-h-screen bg-[#001428] text-[#e6f9ff]">
      <div className="mx-auto max-w-6xl px-4 pb-16">
        <Header />
        <div className="mt-8">
          <h1 className="text-3xl font-bold">Search Results</h1>
          <p className="text-lg text-gray-300">
            Showing results for:{" "}
            <span className="font-bold text-white">"{searchQuery}"</span>
          </p>
        </div>

        {/* We pass the resolved searchQuery down to the component that needs it */}
        <Suspense fallback={<p>Loading...</p>}>
          <SearchResults query={searchQuery} />
        </Suspense>
      </div>
    </div>
  );
}

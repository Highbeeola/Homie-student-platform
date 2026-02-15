import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { ListingCard } from "@/components/ListingCard";
import { SearchFilters } from "@/components/SearchFilters";

export const dynamic = "force-dynamic";

type BrowsePageProps = {
  searchParams: Promise<{
    location?: string;
    maxPrice?: string;
    roomType?: string;
  }>;
};

export default async function BrowsePage(props: BrowsePageProps) {
  // Await params for Next.js 15+
  const params = await props.searchParams;
  const supabase = await createSupabaseServerClient();

  // --- BUILD THE QUERY ---
  let query = supabase
    .from("listings")
    .select("*, profiles!listings_user_id_fkey(verification_status)") // Fetch listing + verified status
    .order("created_at", { ascending: false });

  // 1. Filter by Location (Case insensitive search)
  if (params.location) {
    query = query.ilike("location", `%${params.location}%`);
  }

  // 2. Filter by Max Price
  if (params.maxPrice) {
    query = query.lte("price", parseInt(params.maxPrice));
  }

  // 3. Filter by Room Type
  if (params.roomType) {
    // If user selects "Shared", we might check capacity > 1 or specific text
    if (params.roomType === "Shared") {
      query = query.gt("capacity", 1);
    } else {
      query = query.eq("rooms", params.roomType);
    }
  }

  const { data: listings, error } = await query;

  return (
    <div className="min-h-screen bg-[#041322] px-4 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-2 text-3xl font-bold">Browse Listings</h1>
        <p className="mb-8 text-gray-400">Find your perfect student home.</p>

        {/* Insert Search Component */}
        <SearchFilters />

        {/* Results Grid */}
        {error ? (
          <p className="text-red-400">Error loading listings.</p>
        ) : listings && listings.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="mt-20 text-center">
            <p className="text-xl font-bold text-gray-500">No homes found.</p>
            <p className="text-gray-600">Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

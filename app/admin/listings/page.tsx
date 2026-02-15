import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { AdminListingDelete } from "@/components/AdminListingDelete";
import Image from "next/image";

export const dynamic = "force-dynamic"; // Ensure we always get fresh data

export default async function AdminListingsPage() {
  const supabase = await createSupabaseServerClient();

  // 1. Fetch ALL listings (Admin Policy allows this)
  const { data: listings, error } = await supabase
    .from("listings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="text-red-400 p-8">
        Error loading listings: {error.message}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 text-[#00d4ff]">
        Manage Listings
      </h1>
      <p className="mb-8 text-gray-400">
        Moderation content: View and remove inappropriate listings.
      </p>

      <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-white/5">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#bcdff0]">
                Listing
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#bcdff0]">
                Price & Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#bcdff0]">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#bcdff0]">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 text-sm text-gray-300">
            {listings && listings.length > 0 ? (
              listings.map((listing) => (
                <tr
                  key={listing.id}
                  className="hover:bg-white/5 transition-colors"
                >
                  {/* Column 1: Image & Title */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded bg-black/50 relative">
                        {listing.image_url ? (
                          <Image
                            src={listing.image_url}
                            alt="Listing"
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-gray-500">
                            No Img
                          </div>
                        )}
                      </div>
                      <div className="max-w-xs">
                        <div className="font-bold text-white truncate">
                          {listing.title}
                        </div>
                        <div
                          className="text-xs text-gray-500 truncate"
                          title={listing.description}
                        >
                          {listing.description?.substring(0, 50)}...
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Column 2: Price & Location */}
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">
                      ₦{listing.price?.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400">
                      {listing.location}
                    </div>
                  </td>

                  {/* Column 3: Stats */}
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-500/20">
                      {listing.spots_filled || 0} / {listing.capacity || 1}{" "}
                      Occupied
                    </span>
                  </td>

                  {/* Column 4: Delete Button */}
                  <td className="px-6 py-4">
                    <AdminListingDelete listingId={listing.id} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No listings found. The marketplace is empty!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

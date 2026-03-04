import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { ListingCard } from "@/components/ListingCard";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { redirect } from "next/navigation";

// ✅ NO Header import here! The global layout handles it.

export const dynamic = "force-dynamic";

export default async function MyListingsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  const { data: listings } = await supabase
    .from("listings")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-[#041322] text-white px-4 py-8">
      {/* ✅ NO <HeaderClient /> tag here! */}

      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">My Spaces</h1>
            <p className="text-gray-400 mt-2">
              Manage the properties you have listed.
            </p>
          </div>

          <Link
            href="/add-listing"
            className="inline-flex items-center justify-center gap-2 bg-[#00d4ff] text-[#041322] px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
          >
            <PlusCircle size={20} /> List New Space
          </Link>
        </div>

        {!listings?.length ? (
          <div className="text-center mt-12 p-12 border border-white/10 rounded-2xl bg-white/5">
            <h3 className="text-xl font-bold text-white">
              No spaces listed yet
            </h3>
            <p className="text-gray-400 mt-2 mb-6">
              You haven't listed any accommodation yet.
            </p>
            <Link
              href="/add-listing"
              className="text-[#00d4ff] hover:underline font-bold"
            >
              Get started &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div key={listing.id} className="relative group">
                <ListingCard listing={listing} />

                {/* Edit Button Overlay */}
                <Link
                  href={`/my-listings/${listing.id}/edit`}
                  className="absolute top-2 right-2 bg-black/80 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-[#00d4ff] hover:text-black transition-colors z-20"
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

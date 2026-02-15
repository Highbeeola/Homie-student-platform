import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { BookingWidget } from "@/components/BookingWidget";
import { RoommateStatus } from "@/components/RoommateStatus";
import { MapPin, Home, Users, User } from "lucide-react";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ListingDetailPage(props: Props) {
  const params = await props.params;
  const listingId = params.id;

  // DEBUG LOG: Check your VS Code terminal to see what ID is being requested
  console.log("🔍 Requested Listing ID:", listingId);

  const supabase = await createSupabaseServerClient();

  // 1. Fetch Listing (Using maybeSingle to avoid immediate crash)
  const { data: listing, error } = await supabase
    .from("listings")
    .select(
      `
      *,
      profiles (
        full_name,
        email,
        phone_number
      )
    `,
    )
    .eq("id", listingId)
    .maybeSingle(); // <--- Changed from .single() to prevent crashes on 0 rows

  // 2. Handle Errors
  if (error) {
    console.error("❌ Database Error:", JSON.stringify(error, null, 2));
    return notFound();
  }

  if (!listing) {
    console.error("❌ No listing found with ID:", listingId);
    return notFound();
  }

  // --- UI RENDER START ---
  return (
    <div className="min-h-screen bg-[#041322] text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/browse"
          className="mb-6 inline-block text-sm text-[#bcdff0] hover:underline"
        >
          &larr; Back to Browse
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-8">
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-white/5 border border-white/10">
              {listing.image_url ? (
                <Image
                  src={listing.image_url}
                  alt={listing.title || "Listing"}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
              <div className="absolute bottom-4 left-4">
                <RoommateStatus listing={listing} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {listing.image_url_2 && (
                <div className="relative aspect-video overflow-hidden rounded-xl bg-white/5 border border-white/10">
                  <Image
                    src={listing.image_url_2}
                    alt="Gallery"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              {listing.image_url_3 && (
                <div className="relative aspect-video overflow-hidden rounded-xl bg-white/5 border border-white/10">
                  <Image
                    src={listing.image_url_3}
                    alt="Gallery"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            <div>
              <h1 className="text-3xl font-bold sm:text-4xl">
                {listing.title}
              </h1>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-300">
                <div className="flex items-center gap-1">
                  <MapPin size={18} className="text-[#00d4ff]" />{" "}
                  {listing.location}
                </div>
                <div className="flex items-center gap-1">
                  <Home size={18} className="text-[#00d4ff]" /> {listing.rooms}{" "}
                  Room(s)
                </div>
                <div className="flex items-center gap-1">
                  <Users size={18} className="text-[#00d4ff]" /> Capacity:{" "}
                  {listing.capacity}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="mb-4 text-xl font-bold text-[#bcdff0]">
                About this space
              </h2>
              <p className="whitespace-pre-line text-gray-300 leading-relaxed">
                {listing.description}
              </p>
            </div>

            {listing.video_url && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h2 className="mb-4 text-xl font-bold text-[#bcdff0]">
                  Video Tour
                </h2>
                <div className="aspect-video w-full overflow-hidden rounded-lg">
                  <video
                    controls
                    className="h-full w-full bg-black"
                    src={listing.video_url}
                  />
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <BookingWidget listing={listing} />

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="mb-4 text-lg font-bold text-white">
                  Landlord / Agent
                </h3>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/20 text-blue-400">
                    <User size={24} />
                  </div>
                  <div>
                    {/* Safe access to profile data */}
                    <p className="font-bold">
                      {listing.profiles?.full_name || "Homie User"}
                    </p>
                    <p className="text-xs text-gray-400">Verified Seller</p>
                  </div>
                </div>
                {listing.contact_phone && (
                  <a
                    href={`https://wa.me/${listing.contact_phone.replace("+", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-green-500/50 bg-green-500/10 py-3 font-bold text-green-400 hover:bg-green-500 hover:text-white"
                  >
                    Chat on WhatsApp
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

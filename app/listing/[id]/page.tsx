import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BookingWidget } from "@/components/BookingWidget";
import { RoommateStatus } from "@/components/RoommateStatus";
import { ListingGallery } from "@/components/ListingGallery"; // Import the new gallery
import { MapPin, Home, Users, CheckCircle, ShieldAlert } from "lucide-react";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ListingDetailPage(props: Props) {
  const params = await props.params;
  const listingId = params.id;

  const supabase = await createSupabaseServerClient();

  const { data: listing, error } = await supabase
    .from("listings")
    .select(
      `
      *,
      profiles (
        full_name,
        verification_status,
        phone_number
      )
    `,
    )
    .eq("id", listingId)
    .maybeSingle();

  if (error || !listing) return notFound();

  // Logic for Real Data
  const images = [
    listing.image_url,
    listing.image_url_2,
    listing.image_url_3,
  ].filter(Boolean) as string[];
  const isVerified = listing.profiles?.verification_status === "verified";
  const landlordName = listing.profiles?.full_name || "Landlord (No Name Set)";

  return (
    <div className="min-h-screen bg-[#041322] text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* 1. Header Section */}
        <div className="mb-6">
          <Link
            href="/browse"
            className="mb-4 inline-block text-sm text-[#bcdff0] hover:underline"
          >
            &larr; Back to Browse
          </Link>
          <h1 className="text-3xl font-extrabold sm:text-5xl text-white tracking-tight">
            {listing.title}
          </h1>
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-400">
            <MapPin size={16} className="text-[#00d4ff]" />
            <span>{listing.location}</span>
          </div>
        </div>

        {/* 2. Beautiful Image Gallery */}
        <div className="mb-8">
          <ListingGallery images={images} />
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* --- LEFT COLUMN: Description & Video --- */}
          <div className="lg:col-span-2 space-y-10">
            {/* Stats Bar */}
            <div className="flex flex-wrap gap-6 border-b border-white/10 pb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <Home size={24} className="text-[#00d4ff]" />
                </div>
                <div>
                  <p className="font-bold">{listing.rooms} Room(s)</p>
                  <p className="text-xs text-gray-400">Layout</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <Users size={24} className="text-[#00d4ff]" />
                </div>
                <div>
                  <p className="font-bold">{listing.capacity} People</p>
                  <p className="text-xs text-gray-400">Capacity</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Roommate Status Badge Component */}
                <RoommateStatus listing={listing} />
              </div>
            </div>

            {/* Description Text */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                About this space
              </h2>
              <div className="prose prose-invert max-w-none text-gray-300 leading-7 whitespace-pre-line">
                {listing.description}
              </div>
            </div>

            {/* Video Section */}
            {listing.video_url && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  Video Tour
                </h2>
                <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black border border-white/10 shadow-2xl">
                  <video
                    controls
                    className="h-full w-full"
                    src={listing.video_url}
                  />
                </div>
              </div>
            )}
          </div>

          {/* --- RIGHT COLUMN: Sidebar --- */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Booking Box */}
              <BookingWidget listing={listing} />

              {/* Verified Landlord Card */}
              <div className="rounded-2xl border border-white/10 bg-[#0B1D2E] p-6 shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#00d4ff] to-purple-600 flex items-center justify-center text-xl font-bold text-white">
                    {landlordName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-lg text-white">
                      {landlordName}
                    </p>

                    {/* Logic: Only show Verified if DB says so */}
                    {isVerified ? (
                      <div className="flex items-center gap-1 text-green-400 text-xs font-bold mt-1">
                        <CheckCircle size={12} />
                        <span>Verified Seller</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                        <ShieldAlert size={12} />
                        <span>Unverified Member</span>
                      </div>
                    )}
                  </div>
                </div>

                <hr className="border-white/10 mb-4" />

                {listing.contact_phone ? (
                  <a
                    href={`https://wa.me/${listing.contact_phone.replace(/\D/g, "")}`} // Regex removes '+' and spaces
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] py-3 font-bold text-white transition-transform hover:scale-105"
                  >
                    <span>Chat on WhatsApp</span>
                  </a>
                ) : (
                  <p className="text-center text-sm text-gray-500">
                    No contact provided
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

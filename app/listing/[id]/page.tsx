import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { notFound } from "next/navigation";
import Link from "next/link";
import dynamicImport from "next/dynamic"; // ✅ Required for Paystack

import { RoommateStatus } from "@/components/RoommateStatus";
import { ListingGallery } from "@/components/ListingGallery";
import { SaveButton } from "@/components/SaveButton";
import {
  MapPin,
  Home,
  Users,
  CheckCircle,
  ShieldAlert,
  Flag,
  Lock,
} from "lucide-react";

export const dynamic = "force-dynamic";

// ✅ THE FIX: Dynamically import the BookingWidget so Paystack ONLY loads in the browser.
// Make sure there is NO static `import { BookingWidget }` at the top!
const BookingWidget = dynamicImport(
  () => import("@/components/BookingWidget").then((mod) => mod.BookingWidget),
  {
    ssr: false, // This tells Next.js: "Do not run this on the server!"
    loading: () => (
      <div className="h-64 w-full rounded-2xl bg-white/5 border border-white/10 animate-pulse flex items-center justify-center text-gray-500">
        Loading payment securely...
      </div>
    ),
  },
);

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ListingDetailPage(props: Props) {
  const params = await props.params;
  const listingId = params.id;

  const supabase = await createSupabaseServerClient();

  // Fetch the user so we can pass their email to the BookingWidget
  const {
    data: { user },
  } = await supabase.auth.getUser();

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

  // @ts-ignore
  const isVerified = listing.profiles?.verification_status === "verified";
  // @ts-ignore
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

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold sm:text-5xl text-white tracking-tight">
                {listing.title}
              </h1>
              <div className="mt-3 flex items-center gap-2 text-sm text-gray-400">
                <MapPin size={16} className="text-[#00d4ff]" />
                <span>{listing.location}</span>
              </div>
            </div>

            {/* THE NEW SAVE BUTTON */}
            <div className="mt-2 shrink-0">
              <SaveButton listingId={listing.id} />
            </div>
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

            {/* Video Tour Section */}
            {listing.video_url && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  Video Tour
                </h2>
                <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black border border-white/10 shadow-2xl">
                  <video
                    controls
                    playsInline /* CRITICAL FOR iOS/IPHONE */
                    preload="metadata" /* Stops it from downloading the whole video immediately */
                    className="h-full w-full object-cover"
                    src={
                      // AUTOMATIC CLOUDINARY OPTIMIZATION
                      listing.video_url.includes("cloudinary.com")
                        ? listing.video_url.replace(
                            "/upload/",
                            "/upload/f_auto,q_auto,vc_auto/",
                          )
                        : listing.video_url
                    }
                  />
                </div>
              </div>
            )}
          </div>

          {/* --- RIGHT COLUMN: Sidebar --- */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Passed userEmail to the Dynamic BookingWidget */}
              <BookingWidget listing={listing} userEmail={user?.email} />

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
                  <button
                    disabled
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-800 py-3 font-bold text-gray-400 cursor-not-allowed border border-gray-700"
                  >
                    <Lock size={18} />
                    <span>Unlock to Chat on WhatsApp</span>
                  </button>
                ) : (
                  <p className="text-center text-sm text-gray-500">
                    No contact provided
                  </p>
                )}

                {listing.contact_phone && (
                  <p className="text-[10px] text-center text-gray-500 mt-2">
                    Reserve this space to instantly reveal the contact number.
                  </p>
                )}

                {/* FIXED REPORT BUTTON */}
                <div className="mt-6 pt-4 border-t border-white/10 text-center">
                  <a
                    href={`mailto:homieproject@gmail.com?subject=Report Listing ID: ${listing.id}&body=Hello Homie Admin,%0D%0A%0D%0AI want to report the listing titled "${listing.title}".%0D%0A%0D%0AReason for reporting: `}
                    className="inline-flex items-center justify-center gap-2 text-xs font-bold text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <Flag size={14} />
                    Report this listing
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// app/listing/[id]/page.tsx

import { Header } from "@/components/Header";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { Video, Phone, UserCircle, BedDouble, MapPin } from "lucide-react";
import Image from "next/image";

export const dynamic = "force-dynamic";

// This is the correct, modern signature for dynamic server pages
export default async function ListingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createSupabaseServerClient();

  // `params.id` is now a guaranteed string, not a promise
  const { data: listing, error } = await supabase
    .from("listings")
    .select("*, profiles(*)")
    .eq("id", params.id)
    .single();

  if (error || !listing) {
    console.error(`Listing not found for id ${params.id}:`, error);
    notFound();
  }

  const images = [
    listing.image_url,
    listing.image_url_2,
    listing.image_url_3,
  ].filter(Boolean) as string[];
  const listerProfile = listing.profiles as any;

  return (
    <div className="min-h-screen bg-[#001428] text-[#e6f9ff]">
      <div className="mx-auto max-w-6xl px-4 pb-16">
        <Header />
        <div className="mt-8">
          <div>
            <h1 className="text-3xl lg:text-5xl font-bold">{listing.title}</h1>
            <div className="mt-2 flex items-center gap-2 text-lg text-[#bcdff0]">
              <MapPin size={20} />
              <span>{listing.location}</span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2 rounded-lg overflow-hidden">
                  <img
                    src={images[0] || "/placeholder.png"}
                    alt={listing.title || ""}
                    className="w-full h-[400px] object-cover"
                  />
                </div>
                {images[1] && (
                  <div className="rounded-lg overflow-hidden">
                    <img
                      src={images[1]}
                      alt=""
                      className="w-full h-52 object-cover"
                    />
                  </div>
                )}
                {images[2] && (
                  <div className="rounded-lg overflow-hidden">
                    <img
                      src={images[2]}
                      alt=""
                      className="w-full h-52 object-cover"
                    />
                  </div>
                )}
              </div>
              <div className="mt-8">
                <h2 className="text-2xl font-bold border-b border-white/10 pb-2">
                  About this place
                </h2>
                <p className="mt-6 text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
                  {listing.description}
                </p>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="flex justify-between items-baseline">
                  <p className="text-3xl font-extrabold text-white">
                    {formatPrice(listing.price)}
                  </p>
                  <div className="flex items-center gap-2 text-lg text-gray-300">
                    <BedDouble size={20} />
                    <span>{listing.rooms} rooms</span>
                  </div>
                </div>
                <hr className="my-6 border-white/10" />
                <div>
                  <h3 className="font-bold text-gray-400 text-sm uppercase tracking-wider">
                    Listed By
                  </h3>
                  <div className="mt-3 flex items-center gap-3">
                    <UserCircle size={40} className="text-gray-500" />
                    <div>
                      <p className="font-semibold">
                        {listerProfile?.full_name || "A Student"}
                      </p>
                      {listerProfile?.verification_status === "verified" && (
                        <span className="text-xs font-bold text-green-400">
                          Verified Student
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex flex-col gap-3">
                  {listing.video_url && (
                    <a
                      href={listing.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full rounded-lg bg-red-600/80 px-4 py-3 text-center font-bold text-white"
                    >
                      <Video size={20} /> Watch Video Tour
                    </a>
                  )}
                  {listerProfile?.phone_number ? (
                    <a
                      href={`https://wa.me/${listerProfile.phone_number.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full rounded-lg bg-gradient-to-r from-[#00d4ff] to-[#8A6CFF] px-4 py-3 text-center font-bold text-[#041322]"
                    >
                      <Phone size={20} /> Contact Lister
                    </a>
                  ) : (
                    <div className="rounded-lg bg-gray-700/50 px-4 py-3 text-center text-sm text-gray-400">
                      Contact number not provided.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// app/listing/[id]/page.tsx

import { Header } from "@/components/Header";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { Video, Phone } from "lucide-react";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function ListingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createSupabaseServerClient();

  const resolvedParams = await params;
  const id = Array.isArray(resolvedParams.id)
    ? resolvedParams.id[0]
    : resolvedParams.id;

  // --- THE ONLY CHANGE IS HERE ---
  // We are removing the complex JOIN for now to get the page working.
  const { data: listing, error } = await supabase
    .from("listings")
    .select("*") // Just select everything from the listings table
    .eq("id", id)
    .single();
  // -----------------------------

  if (error || !listing) {
    console.error(`Error or listing not found for id ${id}:`, error);
    notFound();
  }

  const images = [
    listing.image_url,
    listing.image_url_2,
    listing.image_url_3,
  ].filter(Boolean) as string[];
  // We can't get the phone number yet, so this part is disabled for now.
  // const ownerPhoneNumber = (listing.profiles as any)?.phone_number;

  return (
    <div className="min-h-screen bg-[#001428] text-[#e6f9ff]">
      <div className="mx-auto max-w-5xl px-4 pb-16">
        <Header />
        <div className="mt-8">
          <div>
            <h1 className="text-4xl font-bold">{listing.title}</h1>
            <p className="mt-2 text-lg text-[#bcdff0]">{listing.location}</p>
          </div>
          <div className="mt-6">
            {images.length > 0 ? (
              <div className="grid grid-cols-2 grid-rows-2 gap-2 h-[500px]">
                <div className="col-span-2 row-span-2 md:col-span-1 md:row-span-2 rounded-lg overflow-hidden">
                  <img
                    src={images[0]}
                    alt={listing.title || ""}
                    className="w-full h-full object-cover"
                  />
                </div>
                {images[1] ? (
                  <div className="col-span-1 row-span-1 rounded-lg overflow-hidden hidden md:block">
                    <img
                      src={images[1]}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="hidden md:block"></div>
                )}
                {images[2] ? (
                  <div className="col-span-1 row-span-1 rounded-lg overflow-hidden hidden md:block">
                    <img
                      src={images[2]}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="hidden md:block"></div>
                )}
              </div>
            ) : (
              <div className="w-full h-96 bg-white/5 rounded-lg flex items-center justify-center">
                <img
                  src="/placeholder.png"
                  alt="Placeholder"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold border-b border-white/10 pb-2">
                About this place
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-4 text-lg">
                <p>
                  <strong>Price:</strong>{" "}
                  <span className="text-[#FF7A66]">
                    {formatPrice(listing.price)}
                  </span>
                </p>
                <p>
                  <strong>Rooms:</strong> {listing.rooms}
                </p>
              </div>
              <p className="mt-6 whitespace-pre-wrap text-gray-300">
                {listing.description}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 h-fit self-start">
              <h3 className="text-xl font-bold">Interested?</h3>
              <div className="mt-4 flex flex-col gap-3">
                {listing.video_url && (
                  <a
                    href={listing.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="..."
                  >
                    <Video size={20} /> Watch Video Tour
                  </a>
                )}
                <a href="#" className="...">
                  <Phone size={20} /> Contact Lister
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

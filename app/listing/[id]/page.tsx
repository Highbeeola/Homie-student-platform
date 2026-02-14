// app/listing/[id]/page.tsx
import { Header } from "@/components/Header";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { Video, MapPin } from "lucide-react";
import { BookingWidget } from "@/components/BookingWidget"; // 1. Import the Widget

export const dynamic = "force-dynamic";

export default async function ListingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createSupabaseServerClient();

  const { data: listing, error } = await supabase
    .from("listings")
    .select("*, profiles(*)")
    .eq("id", params.id)
    .single();

  if (error || !listing) {
    notFound();
  }

  const images = [
    listing.image_url,
    listing.image_url_2,
    listing.image_url_3,
  ].filter(Boolean) as string[];

  return (
    <div className="min-h-screen bg-[#001428] text-[#e6f9ff]">
      <div className="mx-auto max-w-6xl px-4 pb-16">
        <Header />

        <div className="mt-8">
          <h1 className="text-3xl lg:text-5xl font-bold">{listing.title}</h1>
          <div className="mt-2 flex items-center gap-2 text-lg text-[#bcdff0]">
            <MapPin size={20} />
            <span>{listing.location}</span>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side: Images and Description */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2 rounded-lg overflow-hidden">
                  <img
                    src={images[0] || "/placeholder.png"}
                    alt={listing.title || ""}
                    className="w-full h-[400px] object-cover"
                  />
                </div>
                {images.slice(1).map((img, idx) => (
                  <div key={idx} className="rounded-lg overflow-hidden">
                    <img
                      src={img}
                      alt=""
                      className="w-full h-52 object-cover"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <h2 className="text-2xl font-bold border-b border-white/10 pb-2">
                  About this place
                </h2>
                <p className="mt-6 text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
                  {listing.description}
                </p>

                {/* Watch Video Section shifted here to keep sidebar clean */}
                {listing.video_url && (
                  <a
                    href={listing.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 flex items-center justify-center gap-2 w-full max-w-sm rounded-lg bg-red-600/20 border border-red-600/50 px-4 py-3 font-bold text-red-400 hover:bg-red-600/30 transition-all"
                  >
                    <Video size={20} /> Watch Video Tour
                  </a>
                )}
              </div>
            </div>

            {/* Right Side: The Booking Widget Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                {/* 2. Replace your old sidebar content with the Widget */}
                <BookingWidget listing={listing} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// components/ListingCard.tsx
import Image from "next/image";
import Link from "next/link"; // Import the Link component
import type { Listing } from "@/types/listing";

type ListingCardProps = {
  listing: Listing;
};

function formatPrice(n: number) {
  return "₦" + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "/yr";
}

export function ListingCard({ listing }: ListingCardProps) {
  const href = `/listing/${listing.id}`;
  const imgSrc = listing.image_url ?? "https://via.placeholder.com/400x200?text=No+Image";
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
        <div className="relative">
        {/* Use a fallback image if none provided */}
        <Image src={imgSrc} alt={listing.title ?? "Listing image"} width={400} height={200} className="h-44 w-full object-cover" />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#00d4ff]">
              {listing.title}
            </h3>
            <p className="text-sm text-[#bcdff0]">
              {listing.location} • {listing.rooms} rooms
            </p>
          </div>
          <div className="font-extrabold text-[#FF7A66]">
            {listing.price != null ? formatPrice(listing.price) : "Price on request"}
          </div>
        </div>
        <div className="mt-4 flex gap-2 border-t border-white/10 pt-4">
          {href ? (
            <Link
              href={href}
              className="flex-1 rounded-lg bg-gradient-to-r from-[#00d4ff] to-[#8A6CFF] py-2 text-center font-bold text-[#041322]"
            >
              View
            </Link>
          ) : (
            <div className="flex-1 rounded-lg bg-white/5 py-2 text-center font-bold text-white/40">No details</div>
          )}

          <button className="flex-1 rounded-lg border border-white/10 py-2 font-bold text-white transition-colors hover:bg-white/10">
            Contact
          </button>
        </div>
      </div>
    </article>
  );
}

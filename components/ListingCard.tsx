import Link from "next/link";
import Image from "next/image";
import type { Listing } from "@/types/listing";
import { RoommateStatus } from "./RoommateStatus";

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    // Make the entire card a clickable link (Better UX)
    <Link href={`/listing/${listing.id}`} className="group block h-full">
      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all hover:-translate-y-1 hover:border-[#00d4ff]/50 hover:shadow-xl">
        {/* Image Section */}
        <div className="relative h-48 w-full bg-black/50">
          {listing.image_url ? (
            <Image
              src={listing.image_url}
              alt={listing.title || "Listing"}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-500">
              No Image
            </div>
          )}

          {/* Price Badge */}
          <div className="absolute bottom-2 left-2 rounded-lg bg-black/80 px-3 py-1.5 text-sm font-bold text-[#00d4ff] backdrop-blur-md border border-white/10">
            ₦{listing.price?.toLocaleString()} / yr
          </div>

          {/* ❌ Notice we REMOVED the fake absolute badge from the top left here! */}
        </div>

        {/* Content Section */}
        <div className="flex flex-1 flex-col p-4">
          <h3 className="mb-1 text-lg font-bold text-white line-clamp-1">
            {listing.title}
          </h3>
          <p className="mb-4 text-sm text-gray-400 line-clamp-1">
            {listing.location} • {listing.rooms} room(s)
          </p>

          {/* ✅ ONLY USE ONE STATUS COMPONENT (The Real Database One) */}
          <div className="mb-4">
            <RoommateStatus listing={listing} />
          </div>

          <div className="mt-auto pt-3 border-t border-white/10 flex justify-between items-center">
            <span className="text-sm font-bold text-gray-300 group-hover:text-[#00d4ff] transition-colors">
              View Details
            </span>
            <span className="text-[#00d4ff]">&rarr;</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

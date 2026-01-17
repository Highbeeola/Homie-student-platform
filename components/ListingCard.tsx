// components/ListingCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import type { Listing } from "@/types/listing";
import { deleteListingAction } from "@/app/my-listings/actions";
import { formatPrice } from "@/lib/utils"; // 1. We KEEP the import

type ListingCardProps = {
  listing: Listing;
  showManagementControls?: boolean;
};

// 2. WE DELETE the old, duplicate formatPrice function from here.

export function ListingCard({
  listing,
  showManagementControls = false,
}: ListingCardProps) {
  const href = `/listing/${listing.id}`;
  const imgSrc = listing.image_url || "/placeholder.png"; // Use the local image
  const handleDelete = async () => {
    if (confirm("Are you sure you want to permanently delete this listing?")) {
      const result = await deleteListingAction(listing.id);
      if (result?.error) {
        alert(result.error);
      }
    }
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="relative">
        <Image
          src={imgSrc}
          alt={listing.title ?? "Listing image"}
          width={400}
          height={200}
          className="h-44 w-full object-cover"
        />
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
            {/* 3. This call now uses the imported function */}
            {formatPrice(listing.price)}
          </div>
        </div>

        <div className="mt-4 flex gap-2 border-t border-white/10 pt-4">
          {showManagementControls ? (
            <>
              <Link
                href={`/my-listings/${listing.id}/edit`}
                className="flex-1 rounded-lg border border-white/10 py-2 text-center font-bold text-white transition-colors hover:bg-white/10"
              >
                Edit
              </Link>

              <button
                onClick={handleDelete}
                className="flex-1 rounded-lg border border-red-500/40 bg-red-500/20 py-2 font-bold text-red-300 transition-colors hover:bg-red-500/40"
              >
                Delete
              </button>
            </>
          ) : (
            <>
              <Link
                href={href}
                className="flex-1 rounded-lg bg-gradient-to-r from-[#00d4ff] to-[#8A6CFF] py-2 text-center font-bold text-[#041322]"
              >
                View
              </Link>
              <button className="flex-1 rounded-lg border border-white/10 py-2 font-bold text-white transition-colors hover:bg-white/10">
                Contact
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

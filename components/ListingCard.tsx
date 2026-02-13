// components/ListingCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import type { Listing } from "@/types/listing";
import { deleteListingAction } from "@/app/my-listings/actions";
import { formatPrice } from "@/lib/utils";

type ListingCardProps = {
  listing: Listing;
  showManagementControls?: boolean;
};

export function ListingCard({
  listing,
  showManagementControls = false,
}: ListingCardProps) {
  const href = `/listing/${listing.id}`;
  const imgSrc = listing.image_url || "/placeholder.png";

  const spotsLeft = (listing.capacity || 1) - (listing.spots_filled || 0);
  const isAvailable = spotsLeft > 0;

  const handleDelete = async () => {
    if (confirm("Are you sure you want to permanently delete this listing?")) {
      const result = await deleteListingAction(listing.id);
      if (result?.error) {
        alert(result.error);
      }
    }
  };

  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
        !isAvailable ? "opacity-60" : ""
      }`}
    >
      <div className="relative">
        {/* Partially booked badge */}
        {listing.spots_filled > 0 && isAvailable && (
          <div className="absolute top-3 left-3 z-10 rounded-full bg-blue-500 px-3 py-1 text-xs font-bold text-white">
            {`1 ${
              listing.occupants_gender === "male" ? "👨 Male" : "👩 Female"
            } occupant`}
          </div>
        )}

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
            {isAvailable ? formatPrice(listing.price) : "Fully Booked"}
          </div>
        </div>

        {/* Spots left indicator */}
        {listing.capacity > 1 && (
          <p className="mt-2 text-sm font-bold text-green-400">
            {spotsLeft} of {listing.capacity} spots left
          </p>
        )}

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
                className={`flex-1 rounded-lg bg-gradient-to-r from-[#00d4ff] to-[#8A6CFF] py-2 text-center font-bold text-[#041322] ${
                  !isAvailable ? "pointer-events-none bg-gray-500" : ""
                }`}
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

import type { Listing } from "@/types/listing";
import { User, Users } from "lucide-react";

export function RoommateStatus({ listing }: { listing: Listing }) {
  const capacity = listing.capacity || 1;
  const filled = listing.spots_filled || 0;
  const spotsLeft = capacity - filled;
  const gender = listing.occupants_gender;

  // CASE 1: Single Room / Self-Con (Not Shared)
  if (capacity === 1) {
    if (filled > 0) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-500/20 px-3 py-1 text-xs font-bold text-red-400 border border-red-500/30">
          Occupied
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-500/20 px-3 py-1 text-xs font-bold text-green-400 border border-green-500/30">
        Whole Room Available
      </span>
    );
  }

  // CASE 2: Shared Room (Full)
  if (spotsLeft === 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-500/20 px-3 py-1 text-xs font-bold text-red-400 border border-red-500/30">
        <Users className="h-3 w-3" />
        Fully Booked
      </span>
    );
  }

  // CASE 3: Shared Room (Available) - Better UI
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold border ${
            gender === "Male"
              ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
              : gender === "Female"
                ? "bg-pink-500/20 text-pink-400 border-pink-500/30"
                : "bg-green-500/20 text-green-400 border-green-500/30"
          }`}
        >
          <User className="h-3 w-3" />
          {filled === 0 ? "Empty Room" : `${gender} Roommates`}
        </span>

        <span className="text-xs font-bold text-white">
          {spotsLeft} spot{spotsLeft > 1 ? "s" : ""} left
        </span>
      </div>

      {/* Visual Progress Bar */}
      <div className="flex gap-1">
        {Array.from({ length: capacity }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full ${
              i < filled ? "bg-gray-500" : "bg-[#00d4ff]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

import type { Listing } from "@/types/listing";
import { User, Users } from "lucide-react"; // Assuming you use lucide-react or similar icons

export function RoommateStatus({ listing }: { listing: Listing }) {
  const capacity = listing.capacity || 1;
  const filled = listing.spots_filled || 0;
  const spotsLeft = capacity - filled;
  const gender = listing.occupants_gender;

  // 1. If it's a single room (Capacity 1)
  if (capacity === 1) {
    return null; // Or show "Whole Room" badge
  }

  // 2. If it's full
  if (spotsLeft === 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-500/20 px-3 py-1 text-xs font-bold text-red-400">
        <Users className="h-3 w-3" />
        Fully Booked
      </span>
    );
  }

  // 3. If it's empty (Shared but no one there yet)
  if (filled === 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-500/20 px-3 py-1 text-xs font-bold text-green-400">
        <Users className="h-3 w-3" />
        {spotsLeft} Spots Open (First Booker Sets Gender)
      </span>
    );
  }

  // 4. Partially filled (Show Gender Requirement)
  const isMale = gender === "Male";
  return (
    <div className="flex flex-col gap-1">
      <span
        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
          isMale
            ? "bg-blue-500/20 text-blue-400"
            : "bg-pink-500/20 text-pink-400"
        }`}
      >
        <User className="h-3 w-3" />
        {filled} {gender} Occupant{filled > 1 ? "s" : ""}
      </span>
      <span className="text-xs text-white/60 ml-1">
        {spotsLeft} Spot{spotsLeft > 1 ? "s" : ""} Left
      </span>
    </div>
  );
}

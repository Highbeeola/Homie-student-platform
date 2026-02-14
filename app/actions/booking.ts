"use server";

import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";

export async function bookSpotAction(
  listingId: string | number,
  userGender: "Male" | "Female",
) {
  const supabase = await createSupabaseServerClient();

  // 1. Get Current User
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in to book." };

  // 2. Fetch the Listing to check current status
  const { data: listing, error: fetchError } = await supabase
    .from("listings")
    .select("id, capacity, spots_filled, occupants_gender, user_id")
    .eq("id", listingId)
    .single();

  if (fetchError || !listing) return { error: "Listing not found." };

  // 3. Validation Logic

  // A. Check availability
  if (listing.spots_filled >= listing.capacity) {
    return { error: "Sorry, this listing is fully booked." };
  }

  // B. Check Gender Compatibility
  // If spots are filled > 0, the new user MUST match the current occupants' gender
  if (listing.spots_filled > 0 && listing.occupants_gender) {
    if (listing.occupants_gender !== userGender) {
      return {
        error: `This room is currently occupied by ${listing.occupants_gender}s. Only ${listing.occupants_gender}s can book the remaining spot.`,
      };
    }
  }

  // 4. Update the Listing
  // If it's the first booking (spots_filled === 0), we set the gender.
  const newGender =
    listing.spots_filled === 0 ? userGender : listing.occupants_gender;

  const { error: updateError } = await supabase
    .from("listings")
    .update({
      spots_filled: listing.spots_filled + 1,
      occupants_gender: newGender,
    })
    .eq("id", listingId);

  if (updateError) return { error: "Failed to book spot." };

  // 5. Success
  revalidatePath(`/listing/${listingId}`);
  revalidatePath("/browse");
  return { success: true };
}

"use server";

import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";

export async function bookSpotAction(
  listingId: string | number,
  userGender: "Male" | "Female",
) {
  const supabase = await createSupabaseServerClient();

  // 1. Get User
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in." };

  // 2. Fetch Listing Status
  const { data: listing } = await supabase
    .from("listings")
    .select("*")
    .eq("id", listingId)
    .single();

  if (!listing) return { error: "Listing not found." };

  // 3. Validation
  if (listing.spots_filled >= listing.capacity) {
    return { error: "This listing is fully booked." };
  }

  // Check if user already booked this specific listing
  const { data: existingBooking } = await supabase
    .from("bookings")
    .select("*")
    .eq("listing_id", listingId)
    .eq("user_id", user.id)
    .single();

  if (existingBooking) {
    return { error: "You have already booked a spot here!" };
  }

  // Gender Check
  if (listing.spots_filled > 0 && listing.occupants_gender) {
    if (listing.occupants_gender !== userGender) {
      return {
        error: `Gender mismatch. Only ${listing.occupants_gender}s allowed.`,
      };
    }
  }

  // 4. PERFORM THE BOOKING

  // A. Insert into Bookings Table
  const { error: bookingError } = await supabase.from("bookings").insert({
    user_id: user.id,
    listing_id: listingId,
    status: "confirmed",
  });

  if (bookingError) return { error: "Failed to record booking." };

  // B. Update Listing Counts using the Secure Function (RPC)
  const newGender =
    listing.spots_filled === 0 ? userGender : listing.occupants_gender;

  const { error: rpcError } = await supabase.rpc("increment_spot_count", {
    listing_id: listingId,
    new_gender: newGender,
  });

  if (rpcError) {
    console.error("RPC Error:", rpcError);
  }

  // 5. Success
  // Revalidate the paths so data is fresh
  revalidatePath("/my-bookings");
  revalidatePath(`/listing/${listingId}`);

  // ✅ FIX: Return success instead of redirecting on the server
  // This allows BookingWidget.tsx to handle the redirect smoothly without throwing an error!
  return { success: true };
}

// ------------------------------------------------------------------
// CANCEL BOOKING ACTION
// ------------------------------------------------------------------

export async function cancelBookingAction(bookingId: string) {
  const supabase = await createSupabaseServerClient();

  // 1. Get the booking FIRST so we know which listing to update
  const { data: booking, error: fetchError } = await supabase
    .from("bookings")
    .select("listing_id")
    .eq("id", bookingId)
    .single();

  if (fetchError || !booking) {
    return { error: "Booking not found." };
  }

  // 2. Delete the Booking
  const { error: deleteError } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (deleteError) {
    return { error: "Failed to delete booking. Permissions error?" };
  }

  // 3. Call the Secure Database Function to lower the count
  const { error: rpcError } = await supabase.rpc("decrement_spot_count", {
    listing_id_input: booking.listing_id,
  });

  if (rpcError) {
    console.error("Counter update failed:", rpcError);
  }

  revalidatePath("/my-bookings");

  return { success: true };
}

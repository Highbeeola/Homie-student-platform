"use server";

import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";

// app/actions/booking.ts

export async function bookSpotAction(
  listingId: string | number,
  userGender: "Male" | "Female" | "",
  paymentReference: string, // ✅ NEW: Accept Paystack Ref
  amountPaid: number, // ✅ NEW: Accept Amount Paid
) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in." };

  const { data: listing } = await supabase
    .from("listings")
    .select("*")
    .eq("id", listingId)
    .single();
  if (!listing) return { error: "Listing not found." };

  if (listing.spots_filled >= listing.capacity) {
    return { error: "This listing is fully booked." };
  }

  // Check if already booked
  const { data: existingBooking } = await supabase
    .from("bookings")
    .select("*")
    .eq("listing_id", listingId)
    .eq("user_id", user.id)
    .single();

  if (existingBooking) return { error: "You have already booked a spot here!" };

  if (
    listing.spots_filled > 0 &&
    listing.occupants_gender &&
    listing.occupants_gender !== userGender
  ) {
    return {
      error: `Gender mismatch. Only ${listing.occupants_gender}s allowed.`,
    };
  }

  // ✅ 1. Insert into Bookings WITH PAYMENT DATA
  const { error: bookingError } = await supabase.from("bookings").insert({
    user_id: user.id,
    listing_id: listingId,
    status: "confirmed",
    payment_reference: paymentReference,
    amount_paid: amountPaid,
  });

  if (bookingError) return { error: "Failed to record booking." };

  // ✅ 2. Update Listing Counts
  const newGender =
    listing.spots_filled === 0 ? userGender : listing.occupants_gender;
  const { error: rpcError } = await supabase.rpc("increment_spot_count", {
    listing_id: listingId,
    new_gender: newGender,
  });

  revalidatePath("/my-bookings");
  revalidatePath(`/listing/${listingId}`);
  return { success: true };
}

// ... keep your cancelBookingAction as it is ...
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

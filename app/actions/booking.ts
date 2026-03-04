"use server";

import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

  // Gender Check (logic remains the same)
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
    // Note: We don't fail the whole action here because the booking record was already created
  }

  // 5. Success & Redirect
  revalidatePath("/my-bookings");
  revalidatePath(`/listing/${listingId}`);
  redirect("/my-bookings");
}

// ... inside app/actions/booking.ts

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
  // We use .rpc() because the user doesn't have permission to edit the listing table directly
  const { error: rpcError } = await supabase.rpc("decrement_spot_count", {
    listing_id_input: booking.listing_id,
  });

  if (rpcError) {
    console.error("Counter update failed:", rpcError);
    // We don't return an error here because the booking was already deleted,
    // so from the user's perspective, it's done.
    // Ideally, you'd use a transaction, but for MVP this is fine.
  }

  revalidatePath("/my-bookings");
  return { success: true };
}

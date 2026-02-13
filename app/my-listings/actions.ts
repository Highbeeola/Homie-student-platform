"use server";

import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Listing } from "@/types/listing";

// Type for form data: We omit auto-generated fields
type ListingFormData = Omit<
  Listing,
  "id" | "created_at" | "updated_at" | "user_id"
>;

/**
 * ACTION: Save Listing (Create or Update)
 */
export async function saveListingAction(
  formData: ListingFormData,
  listingId?: string | number,
) {
  const supabase = await createSupabaseServerClient();

  // 1. Authentication Check
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You must be logged in to save a listing." };
  }

  // 2. Server-Side Validation
  if (!formData.title || formData.title.length < 5) {
    return { error: "Title must be at least 5 characters long." };
  }
  if (!formData.price || formData.price < 10000) {
    return { error: "Price must be at least 10,000." };
  }
  if (!formData.contact_phone || formData.contact_phone.length < 10) {
    return { error: "A valid contact phone number is required." };
  }

  // 3. Prepare Data
  const listingData = {
    ...formData,
    user_id: user.id, // Always enforce the server-side User ID
  };

  let error;

  if (listingId) {
    // --- UPDATE MODE ---
    // Security: .eq('user_id', user.id) prevents users from editing someone else's listing
    const { error: updateError } = await supabase
      .from("listings")
      .update(listingData)
      .eq("id", listingId)
      .eq("user_id", user.id);
    error = updateError;
  } else {
    // --- CREATE MODE ---
    const { error: insertError } = await supabase
      .from("listings")
      .insert(listingData);
    error = insertError;
  }

  // 4. Handle Database Errors
  if (error) {
    console.error("Save Listing Error:", error);
    return { error: "Database error: Could not save the listing." };
  }

  // 5. Revalidate and Redirect
  // We refresh both the dashboard and the main feed
  revalidatePath("/my-listings");
  revalidatePath("/");

  // Redirect back to the dashboard on success
  redirect("/my-listings");
}

/**
 * ACTION: Delete Listing
 */
export async function deleteListingAction(listingId: number | string) {
  const supabase = await createSupabaseServerClient();

  // 1. Authentication Check
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You must be logged in to delete a listing." };
  }

  // 2. Execute Delete
  // Security: Ensure user_id matches so users can't delete via URL manipulation
  const { error } = await supabase
    .from("listings")
    .delete()
    .eq("id", listingId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting listing:", error);
    return { error: "Failed to delete listing." };
  }

  // 3. Refresh UI
  revalidatePath("/my-listings");
  revalidatePath("/");
  return { success: true };
}

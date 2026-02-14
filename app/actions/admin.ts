"use server";

import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";

// ⚠️ REPLACE WITH YOUR ACTUAL EMAILS
const ADMIN_EMAILS = [
  "ibrahimoladehinde1@gmail.com",
  "monsuratoladehinde69@gmail.com",
];

// Helper: Securely check if the current user is an admin
async function checkAdminOrThrow() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email || !ADMIN_EMAILS.includes(user.email)) {
    throw new Error("Unauthorized: You are not an admin.");
  }
  return supabase;
}

// 1. Approve User Action
export async function approveUser(userId: string) {
  try {
    const supabase = await checkAdminOrThrow();

    const { error } = await supabase
      .from("profiles")
      .update({ verification_status: "verified" })
      .eq("id", userId);

    if (error) throw error;

    revalidatePath("/admin/verify");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

// 2. Reject User Action
export async function rejectUser(userId: string) {
  try {
    const supabase = await checkAdminOrThrow();

    const { error } = await supabase
      .from("profiles")
      .update({
        verification_status: "rejected",
        id_card_url: null,
      })
      .eq("id", userId);

    if (error) throw error;

    revalidatePath("/admin/verify");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Delete a Listing (Moderation)
 */
export async function adminDeleteListing(listingId: number | string) {
  try {
    const supabase = await checkAdminOrThrow(); // Uses the secure helper we built

    // Delete the listing
    const { error } = await supabase
      .from("listings")
      .delete()
      .eq("id", listingId);

    if (error) throw error;

    revalidatePath("/admin/listings");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

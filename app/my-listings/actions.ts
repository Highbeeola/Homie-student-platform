// app/my-listings/actions.ts
"use server";

import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";

export async function deleteListingAction(listingId: number | string) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You must be logged in to delete a listing." };
  }

  const { error } = await supabase
    .from("listings")
    .delete()
    .eq("id", listingId)
    .eq("user_id", user.id); // This ensures you can only delete your own listings

  if (error) {
    console.error("Error deleting listing:", error);
    return { error: "Failed to delete listing." };
  }

  // Automatically refresh the /my-listings page so the user sees the change
  revalidatePath("/my-listings");
  return { success: true };
}

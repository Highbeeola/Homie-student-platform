"use server";

import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";

// UPDATE THIS with your real emails
const ADMIN_EMAILS = ["your-email@gmail.com", "cofounder@gmail.com"];

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

// 1. Approve User
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

// 2. Reject User
export async function rejectUser(userId: string) {
  try {
    const supabase = await checkAdminOrThrow();
    const { error } = await supabase
      .from("profiles")
      .update({ verification_status: "rejected", id_card_url: null })
      .eq("id", userId);
    if (error) throw error;
    revalidatePath("/admin/verify");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

// 3. Revoke User (Make unverified again)
export async function revokeUser(userId: string) {
  try {
    const supabase = await checkAdminOrThrow();
    const { error } = await supabase
      .from("profiles")
      .update({ verification_status: "unverified" })
      .eq("id", userId);
    if (error) throw error;
    revalidatePath("/admin/verify");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

// 4. Delete Listing (THE MISSING FUNCTION)
export async function adminDeleteListing(listingId: number | string) {
  try {
    const supabase = await checkAdminOrThrow();

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

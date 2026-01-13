// app/admin/actions.ts
"use server";

import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";

export async function approveUser(userId: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("profiles")
    .update({ verification_status: "verified" })
    .eq("id", userId);

  if (error) return { error: "Failed to approve user." };

  revalidatePath("/admin"); // Refresh the admin page
  return { success: true };
}

export async function rejectUser(userId: string) {
  const supabase = await createSupabaseServerClient();
  // We reset their status and clear the ID card URL for privacy
  const { error } = await supabase
    .from("profiles")
    .update({ verification_status: "unverified", id_card_url: null })
    .eq("id", userId);

  if (error) return { error: "Failed to reject user." };

  revalidatePath("/admin"); // Refresh the admin page
  return { success: true };
}

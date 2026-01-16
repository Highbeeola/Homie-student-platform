// app/listing/[id]/page.tsx

// This line is VERY important. It forces the page to be dynamic and not cached.
export const dynamic = "force-dynamic";

import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { notFound } from "next/navigation";

export default async function ListingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // --- START OF DEBUGGING ---
  console.log("--- DEBUGGING LISTING DETAIL PAGE ---");
  console.log("Page was called with params:", params);

  if (!params || !params.id) {
    console.error("CRITICAL ERROR: params.id is missing or undefined.");
    return notFound();
  }

  console.log(`Attempting to fetch listing with ID: ${params.id}`);
  // --- END OF DEBUGGING ---

  const supabase = await createSupabaseServerClient();

  const { data: listing, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error) {
    console.error("Supabase query returned an error:", error);
  }

  if (!listing) {
    console.log("Query was successful, but no listing was found with that ID.");
    return notFound();
  }

  console.log("SUCCESS: Listing found!", listing);

  // We will just return a simple success message for now.
  // This removes all other variables (Header, Image, formatPrice) from the equation.
  return (
    <div>
      <h1>Listing Found!</h1>
      <p>ID: {listing.id}</p>
      <p>Title: {listing.title}</p>
      <pre>{JSON.stringify(listing, null, 2)}</pre>
    </div>
  );
}

// app/my-listings/[id]/edit/page.tsx

import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { notFound, redirect } from "next/navigation";
import { ListingForm } from "@/components/ListingForm"; // Use the new path to your component
import { Header } from "@/components/Header";
import type { Listing } from "@/types/listing";

export default async function EditListingPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth");
  }

  const { data: listing, error } = await supabase
    .from("listings")
    .select<"*", Listing>("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (error || !listing) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#001428] text-[#e6f9ff]">
      <div className="mx-auto max-w-6xl px-4 pb-16">
        <Header />
        <div className="mx-auto mt-12 max-w-2xl">
          {/* We pass the fetched listing data down to the form component */}
          <ListingForm listing={listing} />
        </div>
      </div>
    </div>
  );
}

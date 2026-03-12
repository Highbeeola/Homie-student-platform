import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { notFound, redirect } from "next/navigation";
import { ListingForm } from "@/components/ListingForm";
import type { Listing } from "@/types/listing";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditListingPage(props: Props) {
  // 1. Await params properly for Next.js 15+
  const params = await props.params;
  const listingId = params.id;

  const supabase = await createSupabaseServerClient();

  // 2. Check Auth
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth");
  }

  // 3. Fetch the listing
  // Security: .eq("user_id", user.id) ensures they can only edit THEIR OWN listing
  const { data: listing, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", listingId)
    .eq("user_id", user.id)
    .single();

  if (error || !listing) {
    console.error("Edit fetch error:", error);
    return notFound();
  }

  // 4. Render the Form (No Header needed, layout.tsx handles it)
  return (
    <div className="min-h-screen bg-[#041322] text-[#e6f9ff] py-12">
      <div className="mx-auto max-w-3xl px-4">
        {/* Back Button */}
        <a
          href="/my-listings"
          className="inline-block text-sm text-[#bcdff0] hover:underline mb-6"
        >
          &larr; Back to My Spaces
        </a>

        {/* The Form */}
        <ListingForm listing={listing} />
      </div>
    </div>
  );
}

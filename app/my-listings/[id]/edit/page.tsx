// app/my-listings/[id]/edit/page.tsx
export const dynamic = "force-dynamic";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { notFound, redirect } from "next/navigation";
import { ListingForm } from "@/components/ListingForm";
import { Header } from "@/components/Header";
import type { Listing } from "@/types/listing";

// We use the Promise<...> signature here
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth");
  }

  // THE PROVEN FIX: We await the params promise
  const resolvedParams = await params;
  const id = Array.isArray(resolvedParams.id)
    ? resolvedParams.id[0]
    : resolvedParams.id;
  if (!id) {
    return notFound();
  }

  const { data: listing, error } = await supabase
    .from("listings")
    .select<"*", Listing>("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !listing) {
    console.error(`Could not fetch listing to edit with id ${id}:`, error);
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#001428] text-[#e6f9ff]">
      <div className="mx-auto max-w-6xl px-4 pb-16">
        <Header />
        <div className="mx-auto mt-12 max-w-2xl">
          <ListingForm listing={listing} />
        </div>
      </div>
    </div>
  );
}

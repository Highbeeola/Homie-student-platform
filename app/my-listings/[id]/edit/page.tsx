// app/my-listings/[id]/edit/page.tsx

export const dynamic = "force-dynamic";

import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { notFound, redirect } from "next/navigation";
import { ListingForm } from "@/components/ListingForm";
import { Header } from "@/components/Header";
import type { Listing } from "@/types/listing";

// THE FIX IS HERE: The component itself is now an `async` function,
// and we are correctly defining the props type.
export default async function Page({ params }: { params: { id: string } }) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth");
  }

  // `params` may be a Promise in some Next versions; await it so `id` is defined.
  const resolvedParams = await params;

  // Normalize `resolvedParams.id` into a single value and coerce numeric ids to numbers.
  const rawId = Array.isArray(resolvedParams.id) ? resolvedParams.id[0] : resolvedParams.id;
  const idValue = rawId && /^\d+$/.test(rawId) ? Number(rawId) : rawId;

  const { data: listing, error } = await supabase
    .from("listings")
    .select<"*", Listing>("*")
    .eq("id", idValue)
    .eq("user_id", user.id)
    .single();

  // Diagnostic logging to capture why the fetch might be failing in dev.
  // This logs the incoming params, types, user id, and the raw supabase
  // response fields so we can see any hidden details on `error`.
  try {
    console.log("[edit page] params.id:", resolvedParams.id, "(type:", typeof resolvedParams.id, ")");
    console.log("[edit page] rawId:", rawId, "idValue:", idValue, "(type:", typeof idValue, ")");
    console.log("[edit page] user.id:", user.id);
    console.log("[edit page] listing:", listing);
    console.log("[edit page] error:", error);
    console.log("[edit page] error.message:", (error as any)?.message);
    console.log("[edit page] error.details:", (error as any)?.details);
    console.log("[edit page] error.hint:", (error as any)?.hint);
  } catch (e) {
    console.log("[edit page] failed to stringify supabase response", e);
  }

  if (error || !listing) {
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

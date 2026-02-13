// app/add-listing/page.tsx
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { ListingForm } from "@/components/ListingForm";

export default async function AddListingPage() {
  const supabase = await createSupabaseServerClient();

  // THIS IS THE SECURITY CHECK
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    // If no user is logged in, redirect them to the auth page.
    redirect("/auth");
  }

  // If the user is logged in, show the page.
  return (
    <div className="min-h-screen bg-[#001428] text-[#e6f9ff]">
      <div className="mx-auto max-w-6xl px-4 pb-16">
        <Header />
        <div className="mx-auto mt-12 max-w-2xl">
          <ListingForm />
        </div>
      </div>
    </div>
  );
}

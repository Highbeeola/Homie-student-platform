// app/my-listings/[id]/edit/page.tsx

import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { notFound, redirect } from 'next/navigation';
import { ListingForm } from '@/components/ListingForm';
import { Header } from '@/components/Header';
import type { Listing } from '@/types/listing';

export default async function Page({ params }: { params: { id: string } }) {
  console.log('--- STARTING EDIT PAGE DEBUG ---'); // DEBUGGING

  const supabase = await createSupabaseServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/auth');
  }

  // --- DEBUGGING: LET'S SEE THE EXACT VALUES ---
  console.log('Attempting to find listing with ID from URL:', params.id);
  console.log('For the currently logged-in User ID:', user.id);
  // ---------------------------------------------

  const { data: listing, error } = await supabase
    .from('listings')
    .select<"*", Listing>('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  if (error) {
    // Let's log the actual Supabase error if one occurs
    console.error('Supabase query error:', error);
  }

  if (!listing) {
    console.log('RESULT: No listing found that matches both the ID and the User ID.'); // DEBUGGING
    notFound();
  }

  console.log('--- SUCCESS: Found listing. Rendering form. ---'); // DEBUGGING
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
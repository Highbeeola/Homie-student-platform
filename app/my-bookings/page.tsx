import { createSupabaseServerClient } from "@/lib/supabaseServer";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MyBookingsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return <div className="p-8 text-white">Please log in.</div>;

  // Fetch bookings AND the related listing details
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select(
      `
      *,
      listings (
        id,
        title,
        price,
        location,
        image_url,
        contact_phone
      )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-[#041322] px-4 py-8 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-2 text-3xl font-bold">My Bookings</h1>
        <p className="mb-8 text-gray-400">Spaces you have reserved.</p>

        {!bookings || bookings.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center">
            <h3 className="text-xl font-bold text-gray-300">
              No active bookings
            </h3>
            <p className="mt-2 text-gray-500">
              You haven't booked any hostels yet.
            </p>
            <Link
              href="/browse"
              className="mt-6 inline-block rounded-lg bg-[#00d4ff] px-6 py-3 font-bold text-[#041322]"
            >
              Browse Spaces
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking: any) => (
              <div
                key={booking.id}
                className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center"
              >
                {/* Image */}
                <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-lg sm:h-32 sm:w-48">
                  <Image
                    src={booking.listings?.image_url || "/placeholder.png"}
                    alt="Listing"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold">
                    {booking.listings?.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-2 text-sm text-gray-400">
                    <MapPin size={16} />
                    {booking.listings?.location}
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs text-blue-400">
                    <Calendar size={14} />
                    Booked on{" "}
                    {new Date(booking.created_at).toLocaleDateString()}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 sm:items-end">
                  <div className="text-lg font-bold text-[#00d4ff]">
                    ₦{booking.listings?.price?.toLocaleString()}
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/listing/${booking.listings?.id}`}
                      className="rounded bg-white/10 px-4 py-2 text-sm font-bold hover:bg-white/20"
                    >
                      View Space
                    </Link>
                    {booking.listings?.contact_phone && (
                      <a
                        href={`https://wa.me/${booking.listings?.contact_phone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700"
                      >
                        Contact Landlord
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

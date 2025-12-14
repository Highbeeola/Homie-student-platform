// components/ListingCard.tsx
import Image from "next/image";
import Link from "next/link"; // Import the Link component

// This type now reflects the actual data from your Supabase table
type Listing = {
  id: string; // or number, depending on your DB
  image_url: string;
  title: string;
  location: string;
  rooms: string;
  price: number;
};

type ListingCardProps = {
  listing: Listing;
};

function formatPrice(n: number) {
  return "₦" + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "/yr";
}

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="relative">
        {/* We use listing.image_url now, matching our database column */}
        <Image
          src={listing.image_url}
          alt={listing.title}
          width={400}
          height={200}
          className="h-44 w-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#00d4ff]">
              {listing.title}
            </h3>
            <p className="text-sm text-[#bcdff0]">
              {listing.location} • {listing.rooms} rooms
            </p>
          </div>
          <div className="font-extrabold text-[#FF7A66]">
            {formatPrice(listing.price)}
          </div>
        </div>
        <div className="mt-4 flex gap-2 border-t border-white/10 pt-4">
          {/* THE IMPORTANT CHANGE IS HERE: The button is now a Link */}
          <Link
            href={`/listing/${listing.id}`} // This will go to a URL like /listing/123
            className="flex-1 rounded-lg bg-gradient-to-r from-[#00d4ff] to-[#8A6CFF] py-2 text-center font-bold text-[#041322]"
          >
            View
          </Link>
          <button className="flex-1 rounded-lg border border-white/10 py-2 font-bold text-white transition-colors hover:bg-white/10">
            Contact
          </button>
        </div>
      </div>
    </article>
  );
}

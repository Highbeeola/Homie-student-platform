// app/page.tsx

import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ListingCard } from "@/components/ListingCard"; // 1. Import the new card component

// 2. This is our fake data for now. Later, this will come from Supabase!
const dummyListings = [
  {
    id: 1,
    title: "2 Bedroom Apartment",
    location: "Akoka • 5 min",
    rooms: "2",
    price: 150000,
    imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
  },
  {
    id: 2,
    title: "Shared Self-Contain",
    location: "Yaba • Walking Distance",
    rooms: "Shared",
    price: 80000,
    imageUrl: "https://images.unsplash.com/photo-1570129477492-45c003edd2be",
  },
  {
    id: 3,
    title: "Modern 1-Bedroom Flat",
    location: "Onike • 10 min shuttle",
    rooms: "1",
    price: 120000,
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#001428] text-[#e6f9ff]">
      <div className="mx-auto max-w-6xl px-4 pb-16">
        <Header />
        <Hero />

        {/* Section Title */}
        <div className="mt-12 flex items-center justify-between">
          <h3 className="font-bold text-[#bcdff0]">Recommended homes</h3>
          <div className="text-sm text-[#bcdff0]">
            {dummyListings.length} listings
          </div>
        </div>

        {/* The Grid of Listings */}
        <section className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* 3. We loop over our fake data here */}
          {dummyListings.map((listing) => (
            <ListingCard
              key={listing.id} // React needs a unique 'key' for each item in a list
              title={listing.title}
              location={listing.location}
              rooms={listing.rooms}
              price={listing.price}
              imageUrl={listing.imageUrl}
            />
          ))}
        </section>
      </div>
    </div>
  );
}

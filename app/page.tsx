// app/page.tsx
"use client"; // 1. IMPORTANT: Make this a Client Component

import { useState } from "react"; // 2. Import useState
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ListingCard } from "@/components/ListingCard";
import { ListingModal } from "@/components/ListingModal"; // 3. Import the new modal

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
  // 4. Add state for the modal
  const [selectedListing, setSelectedListing] = useState<any | null>(null);

  const handleOpenModal = (listing: any) => {
    setSelectedListing(listing);
  };

  const handleCloseModal = () => {
    setSelectedListing(null);
  };

  return (
    <div className="min-h-screen bg-[#001428] text-[#e6f9ff]">
      <div className="mx-auto max-w-6xl px-4 pb-16">
        <Header />
        <Hero />

        <div className="mt-12 flex items-center justify-between">
          <h3 className="font-bold text-[#bcdff0]">Recommended homes</h3>
          <div className="text-sm text-[#bcdff0]">
            {dummyListings.length} listings
          </div>
        </div>

        <section className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {dummyListings.map((listing) => (
            <ListingCard
              key={listing.id}
              // Pass the whole listing object down
              listing={listing}
              // 5. Pass the function to handle the click
              onViewClick={() => handleOpenModal(listing)}
            />
          ))}
        </section>
      </div>

      {/* 6. Conditionally render the modal */}
      <ListingModal listing={selectedListing} onClose={handleCloseModal} />
    </div>
  );
}

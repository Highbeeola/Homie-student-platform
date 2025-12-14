// components/ListingModal.tsx
"use client";

import { X } from 'lucide-react'; // A nice icon library. Run: npm install lucide-react

type Listing = {
  imageUrl: string;
  title: string;
  location: string;
  rooms: string;
  price: number;
  // We'll add more details like description later
};

type ListingModalProps = {
  listing: Listing | null;
  onClose: () => void;
};

function formatPrice(n: number) {
  return '₦' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '/yr';
}

export function ListingModal({ listing, onClose }: ListingModalProps) {
  if (!listing) {
    return null; // Don't render anything if no listing is selected
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose} // Close modal if clicking on the background
    >
      <div 
        className="relative w-full max-w-3xl rounded-2xl bg-gradient-to-t from-[#041322] to-[#06263a] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={24} />
        </button>
        
        <div className="flex flex-col gap-6 md:flex-row">
          <img src={listing.imageUrl} alt={listing.title} className="h-64 w-full rounded-lg object-cover md:w-1/2" />
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-white">{listing.title}</h2>
            <p className="mt-1 text-lg font-extrabold text-[#FF7A66]">{formatPrice(listing.price)}</p>
            <p className="mt-2 text-[#bcdff0]">{listing.location} • {listing.rooms} rooms</p>
            <p className="mt-4 text-gray-300">
              More detailed description will go here. For now, this is a beautiful placeholder showing the core details of the property.
            </p>
            <div className="mt-auto flex gap-4 pt-4">
              <a href="#" className="flex-1 rounded-lg bg-gradient-to-r from-[#00d4ff] to-[#8A6CFF] py-3 text-center font-bold text-[#041322]">
                Contact Owner (WhatsApp)
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
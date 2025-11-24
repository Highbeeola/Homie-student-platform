"use client";
import { useState } from "react";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import PropertyCard from "./components/PropertyCard";
import AddListingForm from "./components/AddListingForm";
import PropertyModal from "./components/PropertyModal";

export default function HomePage() {
  // Sample data with sellers, multiple images, and video URLs
  const [listings, setListings] = useState([
    {
      id: 1,
      title: "2 Bedroom Flat",
      price: 150000,
      location: "Akoka",
      rooms: 2,
      seller: "Adewale Johnson",
      description:
        "Spacious 2-bedroom apartment in a secure block with 24/7 generator and water supply. Fast internet available. 5-minute walk to main campus gate.",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      images: [
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
        "https://images.unsplash.com/photo-1502672260066-6bc436c1d5a3?w=800",
        "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
      ],
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
    {
      id: 2,
      title: "Self Contain",
      price: 80000,
      location: "Yaba",
      rooms: 1,
      seller: "Chioma Okafor",
      description:
        "Cozy self-contain apartment in a friendly compound. Close to market, restaurants, and campus shuttle stop. Peaceful neighborhood.",
      image:
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800",
      images: [
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800",
        "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800",
      ],
      videoUrl: "https://www.youtube.com/watch?v=example123",
    },
    {
      id: 3,
      title: "Shared Apartment",
      price: 60000,
      location: "Bariga",
      rooms: "Shared",
      seller: "Ibrahim Yusuf",
      description:
        "Looking for a roommate to share spacious 2-bedroom. Your own room, shared kitchen/bathroom. Very affordable and close to campus.",
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      images: [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      ],
      videoUrl: "https://www.youtube.com/watch?v=example456",
    },
    {
      id: 4,
      title: "3 Bedroom Apartment",
      price: 200000,
      location: "Akoka",
      rooms: 3,
      seller: "Funke Adebayo",
      description:
        "Luxury 3-bedroom for group of friends. Modern fittings, ample parking, gated compound with security. Perfect for 3-4 students.",
      image:
        "https://images.unsplash.com/photo-1502672260066-6bc436c1d5a3?w=800",
      images: [
        "https://images.unsplash.com/photo-1502672260066-6bc436c1d5a3?w=800",
        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800",
        "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
      ],
      videoUrl: "https://www.youtube.com/watch?v=example789",
    },
    {
      id: 5,
      title: "Studio Apartment",
      price: 95000,
      location: "Yaba",
      rooms: 1,
      seller: "Tunde Bakare",
      description:
        "Modern studio with everything you need. Kitchenette, private bathroom, study area. Quiet building perfect for serious students.",
      image:
        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800",
      images: [
        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      ],
      videoUrl: "https://www.youtube.com/watch?v=exampleABC",
    },
    {
      id: 6,
      title: "Mini Flat",
      price: 120000,
      location: "Somolu",
      rooms: 1,
      seller: "Blessing Okoro",
      description:
        "Newly renovated mini flat with modern fixtures. Spacious living area, 24/7 security, convenient location near major bus stops.",
      image:
        "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
      images: [
        "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
        "https://images.unsplash.com/photo-1502672260066-6bc436c1d5a3?w=800",
      ],
      videoUrl: "https://www.youtube.com/watch?v=exampleXYZ",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Filter listings based on search and price
  const filteredListings = listings.filter((listing) => {
    const matchesSearch =
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchQuery.toLowerCase());

    const min = minPrice ? parseInt(minPrice) : 0;
    const max = maxPrice ? parseInt(maxPrice) : Infinity;
    const matchesPrice = listing.price >= min && listing.price <= max;

    return matchesSearch && matchesPrice;
  });

  // Add new listing
  const addListing = (newListing) => {
    setListings([...listings, { ...newListing, id: Date.now() }]);
    setShowForm(false);
  };

  // Open modal with selected listing
  const handleViewDetails = (listing) => {
    setSelectedListing(listing);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen">
      <Navbar onAddClick={() => setShowForm(true)} />

      <main className="max-w-6xl mx-auto px-8 py-16">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Find your trusted student home
          </h1>
          <p className="text-gray-300 text-lg mb-8">
            Listings posted by graduating students — real photos, video tours,
            direct contact
          </p>

          {/* Search & Filters */}
          <div className="space-y-4">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />

            {/* Price Filters */}
            <div className="flex gap-3 items-center flex-wrap">
              <span className="text-gray-400 text-sm font-semibold">
                Filter by price:
              </span>
              <input
                type="number"
                placeholder="Min ₦"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg outline-none focus:border-cyan-500 w-32 text-white"
              />
              <span className="text-gray-400">—</span>
              <input
                type="number"
                placeholder="Max ₦"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg outline-none focus:border-cyan-500 w-32 text-white"
              />
              {(minPrice || maxPrice) && (
                <button
                  onClick={() => {
                    setMinPrice("");
                    setMaxPrice("");
                  }}
                  className="text-sm text-cyan-400 hover:text-cyan-300 underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-2">Total Listings</p>
            <p className="text-4xl font-bold">{listings.length}</p>
          </div>
          <div className="glass rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-2">Available Now</p>
            <p className="text-4xl font-bold text-green-400">
              {listings.length}
            </p>
          </div>
          <div className="glass rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-2">Avg. Price</p>
            <p className="text-4xl font-bold text-cyan-400">
              ₦
              {Math.round(
                listings.reduce((sum, l) => sum + l.price, 0) /
                  listings.length /
                  1000
              )}
              k
            </p>
          </div>
        </div>

        {/* Section Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">
            {searchQuery || minPrice || maxPrice
              ? "Search Results"
              : "Recommended Homes"}
          </h2>
          <span className="text-gray-400">
            {filteredListings.length} listings
          </span>
        </div>

        {/* Listings - Changed from Grid to Vertical List */}
        <div className="space-y-6">
          {filteredListings.map((listing) => (
            <PropertyCard
              key={listing.id}
              listing={listing}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredListings.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏠</div>
            <p className="text-gray-400 text-lg mb-6">
              No listings found matching your criteria
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setMinPrice("");
                setMaxPrice("");
              }}
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Modals */}
        {showForm && (
          <AddListingForm
            onClose={() => setShowForm(false)}
            onSave={addListing}
          />
        )}

        {showModal && (
          <PropertyModal
            listing={selectedListing}
            onClose={() => setShowModal(false)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 py-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-8 text-center text-gray-400 space-y-2">
          <p className="text-lg">
            © 2025 Homie — Students helping students find housing
          </p>
          <p className="text-sm">
            Platform currently in development • Preview version
          </p>
        </div>
      </footer>
    </div>
  );
}

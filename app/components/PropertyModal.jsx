"use client";

import { useState } from "react";

export default function PropertyModal({ listing, onClose }) {
  const [currentImage, setCurrentImage] = useState(0);

  if (!listing) return null;

  const formatPrice = (price) => {
    return "₦" + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "/yr";
  };

  const images = listing.images || [listing.image];

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl max-w-5xl w-full my-8 border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="sticky top-4 left-full ml-4 w-10 h-10 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl hover:bg-black/80 transition z-20 float-right mr-4"
        >
          ×
        </button>

        {/* Header */}
        <div className="p-6 border-b border-white/10 clear-both">
          <h2 className="text-3xl font-bold mb-3">{listing.title}</h2>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-lg font-bold">
                {listing.seller?.charAt(0) || "A"}
              </div>
              <div>
                <p className="font-semibold">
                  {listing.seller || "Anonymous Seller"}
                </p>
                <p className="text-xs text-gray-400">
                  Final Year Student • LASU
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-cyan-400">
                {formatPrice(listing.price)}
              </p>
              <p className="text-sm text-gray-400">per year</p>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-3 mb-6">
            {images.map((img, index) => (
              <div
                key={index}
                className={`relative rounded-lg overflow-hidden cursor-pointer transition-all ${
                  currentImage === index
                    ? "ring-2 ring-cyan-400 scale-[1.02]"
                    : "hover:scale-[1.02]"
                }`}
                onClick={() => setCurrentImage(index)}
              >
                <img
                  src={img}
                  alt={`${listing.title} - Photo ${index + 1}`}
                  className="w-full h-56 object-cover"
                />
                {currentImage === index && (
                  <div className="absolute inset-0 bg-cyan-500/20 flex items-center justify-center">
                    <span className="bg-black/70 px-3 py-1 rounded-full text-sm font-semibold">
                      Current View
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Video Tour */}
          {listing.videoUrl && (
            <a
              href={listing.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-lg border border-red-500/20 hover:border-red-500/40 transition-all mb-6 group"
            >
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold mb-0.5">Watch Video Tour</p>
                <p className="text-xs text-gray-400">
                  See a full walkthrough of this property
                </p>
              </div>
              <svg
                className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          )}
        </div>

        {/* Content */}
        <div className="px-6 pb-6 space-y-6">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-white/5 rounded-lg p-4 text-center border border-white/10">
              <p className="text-gray-400 text-xs mb-1">Location</p>
              <p className="font-semibold text-sm">{listing.location}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 text-center border border-white/10">
              <p className="text-gray-400 text-xs mb-1">Rooms</p>
              <p className="font-semibold text-sm">{listing.rooms}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 text-center border border-white/10">
              <p className="text-gray-400 text-xs mb-1">Status</p>
              <p className="font-semibold text-sm text-green-400">Available</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 text-center border border-white/10">
              <p className="text-gray-400 text-xs mb-1">Type</p>
              <p className="font-semibold text-sm">Apartment</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Description
            </h3>
            <p className="text-gray-300 leading-relaxed">
              {listing.description}
            </p>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
              Amenities
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                "24/7 Generator",
                "Water Supply",
                "24/7 Security",
                "Close to Campus",
                "Parking Space",
                "Internet Ready",
              ].map((amenity, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-sm bg-white/5 rounded-lg px-3 py-2.5 border border-white/10"
                >
                  <svg
                    className="w-4 h-4 text-green-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl p-5 border border-cyan-500/20">
            <h3 className="text-lg font-bold mb-3">
              Interested in this property?
            </h3>
            <div className="flex gap-3 flex-wrap">
              <button className="flex-1 min-w-[200px] px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition flex items-center justify-center gap-2">
                Contact {listing.seller?.split(" ")[0] || "Seller"}
              </button>
              <button
                className="px-6 py-3 border border-white/20 rounded-xl hover:bg-white/5 transition"
                title="Share"
              >
                Share
              </button>
              <button
                className="px-6 py-3 border border-white/20 rounded-xl hover:bg-white/5 transition"
                title="Save"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

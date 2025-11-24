export default function PropertyCard({ listing, onViewDetails }) {
  const formatPrice = (price) => {
    return "₦" + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "/yr";
  };

  // This function handles all clicks
  const handleClick = () => {
    console.log("Clicked!", listing.title); // Debug log
    onViewDetails(listing);
  };

  return (
    <div className="glass rounded-lg p-6 hover:bg-white/10 transition-all border border-white/5">
      <div className="flex items-start justify-between gap-6">
        {/* LEFT SIDE: All the Info */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Title - Clickable */}
          <h3
            onClick={handleClick}
            className="text-2xl font-bold text-cyan-400 hover:text-cyan-300 transition cursor-pointer hover:underline"
          >
            {listing.title}
          </h3>

          {/* Seller Info with Avatar */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-sm font-bold flex-shrink-0">
              {listing.seller?.charAt(0) || "A"}
            </div>
            <span className="text-sm text-gray-300">
              Listed by{" "}
              <span className="font-semibold text-white">
                {listing.seller || "Anonymous"}
              </span>
            </span>
          </div>

          {/* Location, Rooms, Status */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              {listing.location}
            </span>
            <span>•</span>
            <span>
              {listing.rooms} room{listing.rooms > 1 ? "s" : ""}
            </span>
            <span>•</span>
            <span className="text-green-400 font-semibold">Available</span>
          </div>

          {/* Short Description - Line Clamped */}
          <p
            className="text-sm text-gray-300 leading-relaxed overflow-hidden"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              lineClamp: 2,
            }}
          >
            {listing.description}
          </p>

          {/* View Photos Link - CLICKABLE - Changed to DIV with onClick */}
          <div
            onClick={handleClick}
            className="text-sm text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-2 group transition-all cursor-pointer w-fit"
          >
            <span>View photos & full details</span>
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>

        {/* RIGHT SIDE: Price & Button */}
        <div className="text-right flex-shrink-0 flex flex-col items-end gap-4">
          {/* Price */}
          <div>
            <p className="text-3xl font-bold text-orange-400 mb-1">
              {formatPrice(listing.price)}
            </p>
            <p className="text-xs text-gray-400">per year</p>
          </div>

          {/* View Details Button */}
          <button
            onClick={handleClick}
            className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition whitespace-nowrap"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

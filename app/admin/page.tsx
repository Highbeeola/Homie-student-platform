import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Verifications */}
        <Link
          href="/admin/verify"
          className="block p-6 rounded-2xl bg-gradient-to-br from-blue-900/40 to-blue-900/10 border border-blue-500/30 hover:border-blue-400 transition-all group"
        >
          <h2 className="text-xl font-bold text-[#00d4ff] group-hover:underline">
            📋 User Verifications
          </h2>
          <p className="text-gray-400 mt-2">
            Review pending student IDs. Approve or reject users.
          </p>
        </Link>

        {/* Card 2: Listings */}
        <Link
          href="/admin/listings"
          className="block p-6 rounded-2xl bg-gradient-to-br from-purple-900/40 to-purple-900/10 border border-purple-500/30 hover:border-purple-400 transition-all group"
        >
          <h2 className="text-xl font-bold text-purple-400 group-hover:underline">
            🏠 Manage Listings
          </h2>
          <p className="text-gray-400 mt-2">
            View all listings on the platform. Delete inappropriate content.
          </p>
        </Link>
      </div>
    </div>
  );
}

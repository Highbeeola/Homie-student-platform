export default function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div className="glass rounded-2xl p-2 flex items-center gap-3">
      <input
        type="text"
        placeholder="Search by location, title, or description..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-1 bg-transparent px-4 py-3 outline-none text-white placeholder-gray-400"
      />
      <button className="px-6 py-3 bg-linear-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold hover:shadow-lg transition">
        Search
      </button>
    </div>
  );
}

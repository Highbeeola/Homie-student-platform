export default function Navbar({ onAddClick }) {
  return (
    <nav className="glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-linear-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-bold text-lg">
            H
          </div>
          <div>
            <h1 className="text-xl font-bold">Homie</h1>
            <p className="text-xs text-gray-400">Students helping students</p>
          </div>
        </div>

        {/* Nav Links */}
        <div className="flex gap-4 items-center">
          <button
            onClick={onAddClick}
            className="px-4 py-2 bg-linear-to-r from-cyan-500 to-blue-600 rounded-full font-semibold hover:shadow-lg transition"
          >
            Add Listing
          </button>
          <button className="px-4 py-2 rounded-full hover:bg-white/5 transition">
            Profile
          </button>
        </div>
      </div>
    </nav>
  );
}

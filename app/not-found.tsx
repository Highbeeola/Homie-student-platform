import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-[#041322] text-white">
      <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] to-purple-600">
        404
      </h1>
      <h2 className="text-2xl font-bold mt-4">Page Not Found</h2>
      <p className="text-gray-400 mt-2 max-w-md">
        Oops! The hostel or page you are looking for has been moved or doesn't
        exist.
      </p>
      <Link
        href="/"
        className="mt-8 px-8 py-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition text-white font-bold"
      >
        Go Back Home
      </Link>
    </div>
  );
}

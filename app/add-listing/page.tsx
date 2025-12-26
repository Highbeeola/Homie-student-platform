// app/add-listing/page.tsx
"use client";

import { useState } from "react";
// Notice you are using HeaderClient, which is a good pattern. Let's keep it.
// We might need to adjust HeaderClient later if it's a Server Component, but for now this is fine.
import HeaderClient from "@/components/HeaderClient";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr"; // 1. UPGRADE TO THE NEW, CORRECT LIBRARY

export default function AddListingPage() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [rooms, setRooms] = useState("1");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 2. CREATE THE CLIENT USING THE NEW, CORRECT FUNCTION
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // 3. THIS IS THE NEW, CORRECT handleSubmit FUNCTION
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Get the current logged-in user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Check if the user is logged in
      if (!user) {
        setError("You must be logged in to create a listing.");
        setLoading(false);
        return;
      }

      // If they are logged in, proceed with inserting the data
      const { error } = await supabase.from("listings").insert([
        {
          title: title,
          price: parseInt(price),
          location: location,
          rooms: rooms,
          description: description,
          image_url: imageUrl,
          user_id: user.id, // THE CRUCIAL FIX: INCLUDE THE USER'S ID
        },
      ]);

      if (error) {
        throw error;
      }

      alert("Listing submitted successfully!");
      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Your JSX (the return statement) is perfect and needs no changes.
  return (
    <div className="min-h-screen bg-[#001428] text-[#e6f9ff]">
      <div className="mx-auto max-w-6xl px-4 pb-16">
        {/* Using HeaderClient here is fine as long as it correctly receives session props */}
        {/* <HeaderClient session={null} />  <-- You might need to pass session data here, we can fix later */}
        <div className="mx-auto mt-12 max-w-2xl">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl">
            <h2 className="text-2xl font-bold">Add a New Listing</h2>
            <p className="mt-2 text-sm text-[#bcdff0]">
              Fill out the details below to help another student find their next
              home.
            </p>
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              {/* All your form inputs are perfect... */}
              <div>
                <label
                  htmlFor="title"
                  className="text-sm font-bold text-[#bcdff0]"
                >
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="mt-2 w-full rounded-lg border-none bg-white/10 px-4 py-2 text-white outline-none"
                  placeholder="e.g., Cozy Self-Contain near Main Gate"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label
                    htmlFor="price"
                    className="text-sm font-bold text-[#bcdff0]"
                  >
                    Price (₦ per year)
                  </label>
                  <input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className="mt-2 w-full rounded-lg border-none bg-white/10 px-4 py-2 text-white outline-none"
                    placeholder="e.g., 150000"
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="location"
                    className="text-sm font-bold text-[#bcdff0]"
                  >
                    Location
                  </label>
                  <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    className="mt-2 w-full rounded-lg border-none bg-white/10 px-4 py-2 text-white outline-none"
                    placeholder="e.g., Akoka, Yaba"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="text-sm font-bold text-[#bcdff0]"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="mt-2 w-full min-h-[100px] rounded-lg border-none bg-white/10 px-4 py-2 text-white outline-none"
                  placeholder="Describe the room, amenities, water/light situation, etc."
                ></textarea>
              </div>
              <div>
                <label
                  htmlFor="imageUrl"
                  className="text-sm font-bold text-[#bcdff0]"
                >
                  Image URL
                </label>
                <input
                  id="imageUrl"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  required
                  className="mt-2 w-full rounded-lg border-none bg-white/10 px-4 py-2 text-white outline-none"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
              {error && (
                <p className="text-center text-sm text-red-400">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-gradient-to-r from-[#00d4ff] to-[#8A6CFF] py-3 font-bold text-[#041322] disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Listing"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// components/ListingForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import type { Listing } from "@/types/listing";
import { ImageUploader } from "@/components/ImageUploader";

export function ListingForm({ listing }: { listing?: Listing }) {
  const [title, setTitle] = useState(listing?.title || "");
  const [price, setPrice] = useState(listing?.price?.toString() || "");
  const [location, setLocation] = useState(listing?.location || "");
  const [rooms, setRooms] = useState(listing?.rooms || "1");
  const [description, setDescription] = useState(listing?.description || "");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing && !imageFile) {
      setError("Please select an image to upload.");
      return;
    }
    if (!title || !price || !location || !description) {
      setError("Please fill out all text fields.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in.");
      let finalImageUrl = listing?.image_url || "";
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const filePath = `public/${user.id}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("listing-images")
          .upload(filePath, imageFile);
        if (uploadError) throw uploadError;
        const {
          data: { publicUrl },
        } = supabase.storage.from("listing-images").getPublicUrl(filePath);
        finalImageUrl = publicUrl;
      }
      const listingData = {
        title,
        price: parseInt(price),
        location,
        rooms,
        description,
        image_url: finalImageUrl,
        user_id: user.id,
      };
      let supabaseError;
      if (listing) {
        const { error } = await supabase
          .from("listings")
          .update(listingData)
          .eq("id", listing.id);
        supabaseError = error;
      } else {
        const { error } = await supabase.from("listings").insert(listingData);
        supabaseError = error;
      }
      if (supabaseError) throw supabaseError;
      router.push("/my-listings");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl">
      <h2 className="text-2xl font-bold">
        {listing ? "Edit Your Listing" : "Add a New Listing"}
      </h2>
      <p className="mt-2 text-sm text-[#bcdff0]">
        {listing
          ? "Update the details for your listing below."
          : "Fill out the details below to help another student."}
      </p>

      {/* THIS IS THE FULL, CORRECT FORM */}
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="text-sm font-bold text-[#bcdff0]">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-2 w-full rounded-lg border-none bg-white/10 px-4 py-2 text-white outline-none"
            placeholder="e.g., Cozy Self-Contain"
          />
        </div>

        {/* Price & Location */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="price" className="text-sm font-bold text-[#bcdff0]">
              Price (₦)
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

        {/* Rooms */}
        <div>
          <label htmlFor="rooms" className="text-sm font-bold text-[#bcdff0]">
            Number of Rooms
          </label>
          <select
            id="rooms"
            value={rooms}
            onChange={(e) => setRooms(e.target.value)}
            required
            className="mt-2 w-full rounded-lg border-none bg-white/10 px-4 py-2 text-white outline-none"
          >
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>Shared</option>
          </select>
        </div>

        {/* Description */}
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
            placeholder="Describe the amenities..."
          ></textarea>
        </div>

        {/* Image Uploader */}
        <div>
          <label className="text-sm font-bold text-[#bcdff0]">
            Listing Image
          </label>
          <div className="mt-2">
            <ImageUploader
              initialImageUrl={listing?.image_url}
              onFileSelect={(file) => setImageFile(file)}
            />
          </div>
        </div>

        {error && <p className="text-center text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gradient-to-r from-[#00d_4ff] to-[#8A6CFF] py-3 font-bold text-[#041322] disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Saving..." : listing ? "Save Changes" : "Submit Listing"}
        </button>
      </form>
    </div>
  );
}

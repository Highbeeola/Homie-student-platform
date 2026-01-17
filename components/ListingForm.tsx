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
  const [videoUrl, setVideoUrl] = useState(listing?.video_url || "");

  // State for all three image files
  const [imageFile1, setImageFile1] = useState<File | null>(null);
  const [imageFile2, setImageFile2] = useState<File | null>(null);
  const [imageFile3, setImageFile3] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Helper function for uploading a single file
  const uploadImage = async (file: File, user_id: string): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const filePath = `private/${user_id}-${Date.now()}-${Math.random()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("listing-images")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("listing-images").getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing && !imageFile1) {
      setError("Please select the main image.");
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

      // Start with existing URLs if in edit mode
      let imageUrl1 = listing?.image_url || "";
      let imageUrl2 = listing?.image_url_2 || "";
      let imageUrl3 = listing?.image_url_3 || "";

      // Upload new files if they were selected
      if (imageFile1) imageUrl1 = await uploadImage(imageFile1, user.id);
      if (imageFile2) imageUrl2 = await uploadImage(imageFile2, user.id);
      if (imageFile3) imageUrl3 = await uploadImage(imageFile3, user.id);

      const listingData = {
        title,
        price: parseInt(price),
        location,
        rooms,
        description,
        user_id: user.id,
        video_url: videoUrl,
        image_url: imageUrl1,
        image_url_2: imageUrl2,
        image_url_3: imageUrl3,
      };

      if (listing) {
        const { error } = await supabase
          .from("listings")
          .update(listingData)
          .eq("id", listing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("listings").insert(listingData);
        if (error) throw error;
      }

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

      {/* THIS IS THE FULL, CORRECTLY STYLED FORM */}
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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
        <div className="flex flex-col gap-6 sm:flex-row">
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
            placeholder="Describe the amenities, water/light situation, etc."
          ></textarea>
        </div>

        {/* Main Image Uploader */}
        <div>
          <label className="text-sm font-bold text-[#bcdff0]">
            Main Image (Required)
          </label>
          <div className="mt-2">
            <ImageUploader
              initialImageUrl={listing?.image_url}
              onFileSelect={(file) => setImageFile1(file)}
            />
          </div>
        </div>

        {/* Additional Image Uploaders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-bold text-[#bcdff0]">
              Additional Image 2
            </label>
            <div className="mt-2">
              <ImageUploader
                initialImageUrl={listing?.image_url_2}
                onFileSelect={(file) => setImageFile2(file)}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-bold text-[#bcdff0]">
              Additional Image 3
            </label>
            <div className="mt-2">
              <ImageUploader
                initialImageUrl={listing?.image_url_3}
                onFileSelect={(file) => setImageFile3(file)}
              />
            </div>
          </div>
        </div>

        {/* Video URL */}
        <div>
          <label
            htmlFor="videoUrl"
            className="text-sm font-bold text-[#bcdff0]"
          >
            Video Tour URL (Optional)
          </label>
          <input
            id="videoUrl"
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="mt-2 w-full rounded-lg border-none bg-white/10 px-4 py-2 text-white outline-none"
            placeholder="e.g., https://youtube.com/watch?v=..."
          />
        </div>

        {error && <p className="text-center text-sm text-red-400">{error}</p>}

        {/* The Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gradient-to-r from-[#00d4ff] to-[#8A6CFF] py-3 font-bold text-[#041322] disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Saving..." : listing ? "Save Changes" : "Submit Listing"}
        </button>
      </form>
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import type { Listing } from "@/types/listing";
import { ImageUploader } from "@/components/ImageUploader";
import { VideoUploader } from "@/components/VideoUploader";
import { saveListingAction } from "@/app/actions/listings";
import dynamic from "next/dynamic";

export function ListingForm({ listing }: { listing?: Listing }) {
  const [title, setTitle] = useState(listing?.title || "");
  const [price, setPrice] = useState(listing?.price?.toString() || "");
  const [location, setLocation] = useState(listing?.location || "");
  const [rooms, setRooms] = useState(listing?.rooms || "1");
  const [capacity, setCapacity] = useState(
    listing?.capacity?.toString() || "1",
  );
  const [description, setDescription] = useState(listing?.description || "");
  const [videoUrl, setVideoUrl] = useState(listing?.video_url || "");
  const [contactPhone, setContactPhone] = useState(
    listing?.contact_phone || "",
  );
  const [lat, setLat] = useState(listing?.latitude || 6.5244);
  const [lng, setLng] = useState(listing?.longitude || 3.3792);
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);

  const spotsFilled = listing?.spots_filled || 0;
  const occupantsGender = listing?.occupants_gender || "any";

  const [imageFile1, setImageFile1] = useState<File | null>(null);
  const [imageFile2, setImageFile2] = useState<File | null>(null);
  const [imageFile3, setImageFile3] = useState<File | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const LocationPicker = dynamic(() => import("@/components/LocationPicker"), {
    ssr: false,
    loading: () => (
      <div className="h-[300px] w-full bg-white/5 animate-pulse rounded-xl" />
    ),
  });
  const handleMapClick = async (newLat: number, newLng: number) => {
    setLat(newLat);
    setLng(newLng);

    // Auto-fill address using OpenStreetMap API (Free)
    setIsFetchingAddress(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLat}&lon=${newLng}`,
      );
      const data = await response.json();

      if (data && data.display_name) {
        // Update the text box
        setLocation(data.display_name);
      }
    } catch (error) {
      console.error("Could not fetch address", error);
    } finally {
      setIsFetchingAddress(false);
    }
  };

  const uploadImage = async (file: File, user_id: string): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const filePath = `listings/${user_id}-${Date.now()}-${Math.random()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from("listing-images")
      .upload(filePath, file);
    if (uploadError) throw uploadError;
    const {
      data: { publicUrl },
    } = supabase.storage.from("listing-images").getPublicUrl(filePath);
    return publicUrl;
  };
  const handlePriceChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "");

    if (!digitsOnly) {
      setPrice("");
      return;
    }

    const formatted = Number(digitsOnly).toLocaleString("en-NG");
    setPrice(formatted);
  };
  const formatPhoneNumber = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 11);

    if (digitsOnly.length <= 4) return digitsOnly;
    if (digitsOnly.length <= 7) {
      return `${digitsOnly.slice(0, 4)} ${digitsOnly.slice(4)}`;
    }
    return `${digitsOnly.slice(0, 4)} ${digitsOnly.slice(4, 7)} ${digitsOnly.slice(7)}`;
  };

  const handlePhoneChange = (value: string) => {
    setContactPhone(formatPhoneNumber(value));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("1. Submit button clicked");
    setError(null);

    // Basic Validation
    if (!listing && !imageFile1) {
      console.log("Validation failed: No main image");
      setError("Please select the main image.");
      return;
    }

    // Capacity Validation (Only if editing)
    if (listing && parseInt(capacity) < spotsFilled) {
      console.log("Validation failed: Capacity lower than occupancy");
      setError(
        `Cannot set capacity lower than current occupants (${spotsFilled}).`,
      );
      return;
    }

    startTransition(async () => {
      try {
        console.log("2. Checking Auth...");
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          console.error("User not logged in");
          throw new Error("You must be logged in.");
        }
        console.log("3. User found:", user.id);

        console.log("4. Starting Image Uploads...");
        let imageUrl1 = listing?.image_url || "";
        let imageUrl2 = listing?.image_url_2 || "";
        let imageUrl3 = listing?.image_url_3 || "";

        if (imageFile1) {
          console.log("Uploading Image 1...");
          imageUrl1 = await uploadImage(imageFile1, user.id);
          console.log("Image 1 Uploaded:", imageUrl1);
        }
        if (imageFile2) {
          console.log("Uploading Image 2...");
          imageUrl2 = await uploadImage(imageFile2, user.id);
          console.log("Image 2 Uploaded:", imageUrl2);
        }
        if (imageFile3) {
          console.log("Uploading Image 3...");
          imageUrl3 = await uploadImage(imageFile3, user.id);
          console.log("Image 3 Uploaded:", imageUrl3);
        }

        const listingData = {
          title,
          price: parseInt(price.replace(/,/g, "")),
          location,
          rooms,
          capacity: parseInt(capacity),
          description,
          video_url: videoUrl,
          image_url: imageUrl1,
          image_url_2: imageUrl2,
          image_url_3: imageUrl3,
          contact_phone: contactPhone.replace(/\s/g, ""),
          user_id: user.id,
          latitude: lat, // 4. Include in data
          longitude: lng,
        };

        console.log("5. Calling Server Action with data:", listingData);

        // The redirect usually happens inside here, which throws an error
        const result = await saveListingAction(listingData as any, listing?.id);

        console.log("6. Server Action Result:", result);

        if (result?.error) {
          console.error("Server Action returned error:", result.error);
          setError(result.error);
        } else {
          // If the server action didn't redirect, we do it here
          console.log("Success! Redirecting...");
          router.push("/my-listings");
          router.refresh();
        }
      } catch (err: any) {
        // ✅ THE FIX: Ignore Next.js redirect errors
        if (err.message && err.message.includes("NEXT_REDIRECT")) {
          console.log("Redirecting successfully...");
          return;
        }

        console.error("ERROR CAUGHT IN FORM:", err);
        setError(err.message || "An unexpected error occurred.");
      }
    });
  };
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl">
      <h2 className="text-2xl font-bold">
        {listing ? "Edit Your Listing" : "Add a New Listing"}
      </h2>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label className="text-sm font-bold text-[#bcdff0]">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-2 w-full rounded-lg border-none bg-white/10 px-4 py-2 text-white outline-none"
            placeholder="e.g.,Nice three bed room apartment"
          />
        </div>

        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="flex-1">
            <label className="text-sm font-bold text-[#bcdff0]">
              Price (₦)
            </label>
            <input
              type="text"
              value={price}
              onChange={(e) => handlePriceChange(e.target.value)}
              required
              inputMode="numeric"
              placeholder="e.g. 120,000"
              className="mt-2 w-full rounded-lg border-none bg-white/10 px-4 py-2 text-white outline-none"
            />
          </div>
          <div className="flex-1">
            <label className="text-sm font-bold text-[#bcdff0]">
              Location{" "}
              {isFetchingAddress && (
                <span className="text-xs text-yellow-400">
                  (Fetching address...)
                </span>
              )}
            </label>
            <input
              name="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="mt-2 w-full rounded-lg border-none bg-white/10 px-4 py-2 text-white outline-none"
            />
          </div>
        </div>
        <div className="mt-6">
          <LocationPicker
            latitude={lat}
            longitude={lng}
            onLocationChange={handleMapClick}
          />
        </div>
        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="flex-1">
            <label className="text-sm font-bold text-[#bcdff0]">Rooms</label>
            <select
              value={rooms}
              onChange={(e) => setRooms(e.target.value)}
              required
              className="mt-2 w-full rounded-lg border border-white/10 bg-[#24384d] px-4 py-2 text-white outline-none"
            >
              <option value="1" className="bg-white text-black">
                1 Room
              </option>
              <option value="2" className="bg-white text-black">
                2 Rooms
              </option>
              <option value="3" className="bg-white text-black">
                3 Rooms
              </option>
              <option value="Shared" className="bg-white text-black">
                Shared Space
              </option>
            </select>
          </div>
          <div className="flex-1">
            <label className="text-sm font-bold text-[#bcdff0]">
              Capacity (Max People)
            </label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              required
              min="1"
              className="mt-2 w-full rounded-lg border-none bg-white/10 px-4 py-2 text-white outline-none"
            />
          </div>
        </div>

        {listing && parseInt(capacity) > 1 && (
          <div className="rounded-lg bg-white/5 p-4 border border-white/10">
            <h3 className="text-sm font-bold text-[#bcdff0] mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
              Roommate Management
            </h3>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-[10px] uppercase tracking-wider text-gray-400">
                  Spots Filled
                </label>
                <div className="mt-1 w-full bg-black/20 text-white px-3 py-2 rounded border border-white/5">
                  {spotsFilled} / {capacity}
                </div>
              </div>
              <div className="flex-1">
                <label className="text-[10px] uppercase tracking-wider text-gray-400">
                  Occupants Gender
                </label>
                <div className="mt-1 w-full bg-black/20 text-white px-3 py-2 rounded border border-white/5">
                  {occupantsGender === "male"
                    ? "👨 Male"
                    : occupantsGender === "female"
                      ? "👩 Female"
                      : "Any"}
                </div>
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="text-sm font-bold text-[#bcdff0]">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mt-2 w-full min-h-[120px] rounded-lg border-none bg-white/10 px-4 py-2 text-white outline-none"
            placeholder="Tell us about the space..."
          />
        </div>

        <div className="space-y-4">
          <label className="text-sm font-bold text-[#bcdff0]">Photos</label>
          <ImageUploader
            initialImageUrl={listing?.image_url}
            onFileSelect={(file) => setImageFile1(file)}
          />
          <div className="grid grid-cols-2 gap-4">
            <ImageUploader
              initialImageUrl={listing?.image_url_2}
              onFileSelect={(file) => setImageFile2(file)}
            />
            <ImageUploader
              initialImageUrl={listing?.image_url_3}
              onFileSelect={(file) => setImageFile3(file)}
            />
          </div>
        </div>

        <div className="pt-4">
          <label className="text-sm font-bold text-[#bcdff0]">Video Tour</label>
          <VideoUploader onUpload={(url) => setVideoUrl(url)} />
          <input
            type="url"
            placeholder="Or paste a link to a video"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="mt-4 w-full rounded-lg border-none bg-white/10 px-4 py-2 text-white outline-none"
          />
        </div>

        <div>
          <label className="text-sm font-bold text-[#bcdff0]">
            WhatsApp Number
          </label>
          <input
            type="tel"
            value={contactPhone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            required
            inputMode="numeric"
            placeholder="e.g. 0812 345 6789"
            className="mt-2 w-full rounded-lg border-none bg-white/10 px-4 py-2 text-white outline-none"
          />
        </div>

        {error && (
          <p className="text-center text-sm text-red-400 bg-red-400/10 py-2 rounded-lg border border-red-400/20">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-gradient-to-r from-[#00d4ff] to-[#8A6CFF] py-4 font-bold text-[#041322] shadow-xl transition-all hover:opacity-90 disabled:opacity-50"
        >
          {isPending
            ? "Processing..."
            : listing
              ? "Save Changes"
              : "Create Listing"}
        </button>
      </form>
    </div>
  );
}

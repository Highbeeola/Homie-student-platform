"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { ImageUploader } from "@/components/ImageUploader";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js"; // Import User type

// ✅ FIX 1: Update the Type Definition to include "rejected"
type Profile = {
  id: string;
  phone_number?: string | null;
  // Added "rejected" to the list below:
  verification_status?: "unverified" | "pending" | "verified" | "rejected";
  id_card_url?: string | null;
  full_name?: string | null;
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null); // Store the Auth User
  const [profile, setProfile] = useState<Profile | null>(null); // Store the DB Profile
  const [loading, setLoading] = useState(true);

  // Phone Number State
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Verification State
  const [idCardFile, setIdCardFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      // 1. Get Auth User
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth");
        return;
      }

      setUser(user); // Save the user so we can access user.email later

      // 2. Get Profile Data
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile(data); // This data might NOT have email, which is fine
        setPhoneNumber(data.phone_number || "");
      } else if (error) {
        console.error("Error fetching profile:", error);
      }
      setLoading(false);
    };
    fetchInitialData();
  }, [router, supabase]);

  // UPDATE PHONE NUMBER
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (!profile) throw new Error("Profile not loaded");

      const { error } = await supabase
        .from("profiles")
        .update({ phone_number: phoneNumber.trim() })
        .eq("id", profile.id);

      if (error) throw error;
      alert("Phone number saved successfully!");

      setProfile((prev) =>
        prev ? { ...prev, phone_number: phoneNumber.trim() } : null,
      );
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // SUBMIT VERIFICATION
  const handleSubmitVerification = async () => {
    if (!idCardFile || !profile) {
      alert("Please select an ID card image to upload.");
      return;
    }

    setIsSubmitting(true);
    try {
      const fileExt = idCardFile.name.split(".").pop();
      const filePath = `verification/${profile.id}-${Date.now()}.${fileExt}`;

      // 1. Upload to Storage
      const { error: uploadError } = await supabase.storage
        .from("listing-images") // Using existing bucket
        .upload(filePath, idCardFile);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("listing-images").getPublicUrl(filePath);

      // 3. Update Profile Database Record
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          id_card_url: publicUrl,
          verification_status: "pending",
        })
        .eq("id", profile.id);

      if (updateError) throw updateError;

      alert("Verification documents submitted! We will review them shortly.");

      setProfile((prev) =>
        prev
          ? { ...prev, verification_status: "pending", id_card_url: publicUrl }
          : null,
      );
    } catch (err: any) {
      alert("Error submitting documents: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#041322] flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  // Handle status display
  const status = profile?.verification_status || "unverified";

  // Define colors for all 4 statuses
  const statusColors = {
    unverified: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    pending: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    verified: "bg-green-500/20 text-green-400 border-green-500/30",
    rejected: "bg-red-500/20 text-red-400 border-red-500/30", // Added rejected color
  };

  return (
    <div className="min-h-screen bg-[#041322] text-white p-4 pb-20">
      <div className="mx-auto mt-8 max-w-lg">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 shadow-2xl">
          <h1 className="text-2xl font-bold">My Profile</h1>

          {/* ✅ FIX 2: Use user.email (Auth) instead of profile.email */}
          <p className="mt-2 text-sm text-gray-400">{user?.email}</p>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-sm text-gray-300">Account Status:</span>
            <span
              className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${statusColors[status] || statusColors.unverified}`}
            >
              {status}
            </span>
          </div>

          <hr className="my-6 border-white/10" />

          {/* PHONE NUMBER SECTION */}
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="text-sm font-bold text-[#bcdff0]">
                WhatsApp Contact Number
              </label>
              <input
                type="tel"
                placeholder="e.g., +2348012345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mt-2 w-full rounded-lg bg-black/30 border border-white/10 px-4 py-3 text-white focus:border-[#00d4ff] outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={isSaving}
              className="w-full rounded-lg bg-white/10 hover:bg-white/20 py-2.5 text-sm font-bold text-white transition disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Phone Number"}
            </button>
          </form>

          <hr className="my-8 border-white/10" />

          {/* VERIFICATION SECTION */}
          {/* ✅ FIX 3: Check for 'rejected' here too */}
          {status === "unverified" || status === "rejected" ? (
            <div>
              <h2 className="text-lg font-bold text-[#00d4ff] mb-2">
                {status === "rejected"
                  ? "Verification Rejected - Try Again"
                  : "Get Verified"}
              </h2>
              <p className="text-sm text-gray-400 mb-4">
                Upload your Student ID to gain the "Verified Seller" badge and
                increase trust.
              </p>

              <div className="mb-4">
                <ImageUploader
                  onFileSelect={(file) => setIdCardFile(file)}
                  initialImageUrl={profile?.id_card_url || undefined}
                />
              </div>

              <button
                onClick={handleSubmitVerification}
                disabled={isSubmitting || !idCardFile}
                className="w-full rounded-lg bg-gradient-to-r from-[#00d4ff] to-[#8A6CFF] py-3 font-bold text-[#041322] hover:opacity-90 disabled:opacity-50"
              >
                {isSubmitting ? "Uploading..." : "Submit ID for Review"}
              </button>
            </div>
          ) : null}

          {status === "pending" && (
            <div className="rounded-lg bg-blue-500/10 p-4 border border-blue-500/20 text-center">
              <p className="font-bold text-blue-400">Under Review</p>
              <p className="mt-1 text-sm text-gray-400">
                Admins are reviewing your ID. This usually takes 24 hours.
              </p>
            </div>
          )}

          {status === "verified" && (
            <div className="rounded-lg bg-green-500/10 p-4 border border-green-500/20 text-center">
              <p className="font-bold text-green-400">✅ You are Verified!</p>
              <p className="mt-1 text-sm text-gray-400">
                Your listings now have the verified badge.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { ImageUploader } from "@/components/ImageUploader";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

// Define the shape of our profile data
type Profile = {
  id: string;
  phone_number?: string | null;
  verification_status?: string; // Relaxed type to handle 'UNVERIFIED' vs 'unverified'
  id_card_url?: string | null;
  full_name?: string | null;
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [fullName, setFullName] = useState("");
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
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth");
        return;
      }

      setUser(user);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile(data);
        setPhoneNumber(data.phone_number || "");
        setFullName(data.full_name || "");
      } else if (error) {
        console.error("Error fetching profile:", error);
      }
      setLoading(false);
    };
    fetchInitialData();
  }, [router, supabase]);

  // 1. Save Profile Details (Name & Phone)
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (!profile) throw new Error("Profile not loaded");

      const { error } = await supabase
        .from("profiles")
        .update({
          phone_number: phoneNumber.trim(),
          full_name: fullName.trim(),
        })
        .eq("id", profile.id);

      if (error) throw error;
      alert("Profile updated successfully!");

      setProfile((prev) =>
        prev
          ? { ...prev, phone_number: phoneNumber, full_name: fullName }
          : null,
      );
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // 2. Upload ID for Verification
  const handleSubmitVerification = async () => {
    if (!idCardFile || !profile) {
      alert("Please select an ID card image to upload.");
      return;
    }

    setIsSubmitting(true);
    try {
      const fileExt = idCardFile.name.split(".").pop();
      // Ensure unique filename
      const filePath = `verification/${profile.id}-${Date.now()}.${fileExt}`;

      // Upload
      const { error: uploadError } = await supabase.storage
        .from("listing-images") // Using existing bucket for simplicity
        .upload(filePath, idCardFile);

      if (uploadError) throw uploadError;

      // Get URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("listing-images").getPublicUrl(filePath);

      // Update DB
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          id_card_url: publicUrl,
          verification_status: "pending", // Set to pending
        })
        .eq("id", profile.id);

      if (updateError) throw updateError;

      alert("ID submitted! Waiting for Admin approval.");

      // Update local state to show "Pending" UI immediately
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

  // --- LOGIC TO HANDLE MESSY STATUS STRINGS ---
  // This cleans up the status (removes quotes, makes lowercase)
  const rawStatus = profile?.verification_status || "unverified";
  const status = rawStatus.toLowerCase().replace(/['"]+/g, ""); // Fixes "'UNVERIFIED'" -> "unverified"

  const statusColors: Record<string, string> = {
    unverified: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    pending: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    verified: "bg-green-500/20 text-green-400 border-green-500/30",
    rejected: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  return (
    <div className="min-h-screen bg-[#041322] text-white p-4 pb-20">
      <div className="mx-auto mt-8 max-w-lg">
        <div className="rounded-2xl border border-white/10 bg-[#0B1D2E] p-6 sm:p-8 shadow-2xl">
          <h1 className="text-2xl font-bold">My Profile</h1>
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

          {/* --- FORM SECTION --- */}
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div>
              <label className="text-sm font-bold text-[#bcdff0]">
                Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Ibrahim Oladehinde"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-2 w-full rounded-lg bg-black/30 border border-white/10 px-4 py-3 text-white focus:border-[#00d4ff] outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-[#bcdff0]">
                WhatsApp Contact Number
              </label>
              <input
                type="tel"
                placeholder="e.g. 08012345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mt-2 w-full rounded-lg bg-black/30 border border-white/10 px-4 py-3 text-white focus:border-[#00d4ff] outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full rounded-lg bg-gradient-to-r from-[#00d4ff] to-[#8A6CFF] py-3 font-bold text-[#041322] hover:opacity-90 disabled:opacity-50 transition-all shadow-md shadow-blue-500/20"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </form>

          {/* --- VERIFICATION SECTION --- */}
          {/* Only show if Unverified or Rejected */}
          {(status === "unverified" || status === "rejected") && (
            <div className="mt-8 pt-8 border-t border-white/10">
              <h2 className="text-lg font-bold text-[#00d4ff] mb-2">
                {status === "rejected"
                  ? "Verification Rejected - Try Again"
                  : "Get Verified"}
              </h2>
              <p className="text-sm text-gray-400 mb-6">
                Upload your Student ID or NIN to get the "Verified Seller"
                badge. This increases trust with students.
              </p>

              <div className="mb-6">
                <ImageUploader
                  onFileSelect={(file) => setIdCardFile(file)}
                  initialImageUrl={profile?.id_card_url || undefined}
                />
              </div>

              <button
                onClick={handleSubmitVerification}
                disabled={isSubmitting || !idCardFile}
                className="w-full rounded-lg bg-gradient-to-r from-[#00d4ff] to-[#8A6CFF] py-3 font-bold text-[#041322] hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/20"
              >
                {isSubmitting ? "Uploading..." : "Submit ID for Review"}
              </button>
            </div>
          )}

          {/* --- PENDING MESSAGE --- */}
          {status === "pending" && (
            <div className="mt-8 rounded-lg bg-blue-500/10 p-4 border border-blue-500/20 text-center">
              <p className="font-bold text-blue-400">ID Under Review</p>
              <p className="mt-1 text-sm text-gray-400">
                Admins are reviewing your document. This usually takes 24 hours.
              </p>
            </div>
          )}

          {/* --- VERIFIED MESSAGE --- */}
          {status === "verified" && (
            <div className="mt-8 rounded-lg bg-green-500/10 p-4 border border-green-500/20 text-center">
              <p className="font-bold text-green-400">✅ You are Verified!</p>
              <p className="mt-1 text-sm text-gray-400">
                Your listings now display the Trusted Seller badge.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

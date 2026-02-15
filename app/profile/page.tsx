"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { ImageUploader } from "@/components/ImageUploader";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

type Profile = {
  id: string;
  phone_number?: string | null;
  verification_status?: "unverified" | "pending" | "verified" | "rejected";
  id_card_url?: string | null;
  full_name?: string | null;
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Phone + Name State
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullName, setFullName] = useState("");

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
          ? {
              ...prev,
              phone_number: phoneNumber.trim(),
              full_name: fullName.trim(),
            }
          : null,
      );
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitVerification = async () => {
    if (!idCardFile || !profile) {
      alert("Please select an ID card image to upload.");
      return;
    }

    setIsSubmitting(true);

    try {
      const fileExt = idCardFile.name.split(".").pop();
      const filePath = `verification/${profile.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("listing-images")
        .upload(filePath, idCardFile);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("listing-images").getPublicUrl(filePath);

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

  const status = profile?.verification_status || "unverified";

  const statusColors = {
    unverified: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    pending: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    verified: "bg-green-500/20 text-green-400 border-green-500/30",
    rejected: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  return (
    <div className="min-h-screen bg-[#041322] text-white p-4 pb-20">
      <div className="mx-auto mt-8 max-w-lg">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 shadow-2xl">
          <h1 className="text-2xl font-bold">My Profile</h1>

          <p className="mt-2 text-sm text-gray-400">{user?.email}</p>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-sm text-gray-300">Account Status:</span>
            <span
              className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${
                statusColors[status] || statusColors.unverified
              }`}
            >
              {status}
            </span>
          </div>

          <hr className="my-6 border-white/10" />

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="text-sm font-bold text-[#bcdff0]">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
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
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </form>

          <hr className="my-8 border-white/10" />

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

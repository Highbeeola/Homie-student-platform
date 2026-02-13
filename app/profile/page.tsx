"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import HeaderClient from "@/components/HeaderClient";
import { ImageUploader } from "@/components/ImageUploader";
import { useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import type { Profile, ProfileStatus } from "@/types/profile";

export default function ProfilePage() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
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
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);

      if (!user) {
        router.push("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select<"*", Profile>("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile(data);
        setPhoneNumber(data.phone_number || ""); // Populate phone input
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

  // SUBMIT VERIFICATION (Restored from your former code)
  const handleSubmitVerification = async () => {
    if (!idCardFile || !profile) {
      alert("Please select an ID card image to upload.");
      return;
    }

    setIsSubmitting(true);
    try {
      const fileExt = idCardFile.name.split(".").pop();
      const filePath = `${profile.id}/student_id.${fileExt}`;

      // 1. Upload to Storage
      const { error: uploadError } = await supabase.storage
        .from("verification-documents")
        .upload(filePath, idCardFile, { upsert: true });

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const {
        data: { publicUrl },
      } = supabase.storage
        .from("verification-documents")
        .getPublicUrl(filePath);

      // 3. Update Profile Database Record
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          id_card_url: publicUrl,
          verification_status: "pending",
        })
        .eq("id", profile.id);

      if (updateError) throw updateError;

      alert(
        "Verification documents submitted! Admin approval usually takes 24-48 hours.",
      );

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              verification_status: "pending",
              id_card_url: publicUrl,
            }
          : null,
      );
    } catch (err: any) {
      alert("Error submitting documents: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-[#001428] text-center p-8">
        <HeaderClient session={session} />
        <p className="mt-20 text-[#e6f9ff]">
          {loading ? "Loading profile..." : "Could not load profile."}
        </p>
      </div>
    );
  }

  const statusColors: Record<ProfileStatus, string> = {
    unverified: "bg-yellow-900/50 text-yellow-300 border-yellow-700",
    pending: "bg-blue-900/50 text-blue-300 border-blue-700",
    verified: "bg-green-900/50 text-green-300 border-green-700",
  };
  const status = profile.verification_status;

  return (
    <div className="min-h-screen bg-[#001428] text-[#e6f9ff]">
      <div className="mx-auto max-w-6xl px-4 pb-16">
        <HeaderClient session={session} />

        <div className="mx-auto mt-12 max-w-lg">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl">
            <h1 className="text-2xl font-bold">My Profile</h1>
            <p className="mt-4 text-gray-400">Email: {session?.user?.email}</p>

            <div className="mt-4 flex items-center gap-2">
              <p>Verification Status:</p>
              <span
                className={`px-3 py-1 text-sm font-semibold rounded-full border ${statusColors[status]}`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>

            {/* PHONE NUMBER SECTION */}
            <form
              onSubmit={handleUpdateProfile}
              className="mt-6 space-y-4 border-t border-white/10 pt-6"
            >
              <div>
                <label
                  htmlFor="phone"
                  className="text-sm font-bold text-[#bcdff0]"
                >
                  WhatsApp Contact Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="e.g., 2348012345678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="mt-2 w-full rounded-lg border-none bg-white/10 px-4 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Phone Number"}
              </button>
            </form>

            <hr className="my-8 border-white/10" />

            {/* VERIFICATION SECTION */}
            {status === "unverified" && (
              <div>
                <h2 className="text-lg font-semibold text-yellow-500">
                  Submit for Verification
                </h2>
                <p className="mt-2 text-sm text-gray-400">
                  Please upload a clear photo of your student ID card to unlock
                  seller features.
                </p>

                <div className="mt-4">
                  <ImageUploader onFileSelect={(file) => setIdCardFile(file)} />
                </div>

                <button
                  onClick={handleSubmitVerification}
                  disabled={isSubmitting || !idCardFile}
                  className="mt-6 w-full rounded-lg bg-gradient-to-r from-[#00d4ff] to-[#8A6CFF] py-3 font-bold text-[#041322] transition hover:opacity-90 disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit ID for Review"}
                </button>
              </div>
            )}

            {status === "pending" && (
              <div className="text-center rounded-lg bg-blue-900/20 p-4 border border-blue-700/30">
                <p className="font-medium">Your ID card is under review.</p>
                <p className="mt-2 text-sm text-gray-400">
                  Verification usually takes 24–48 hours. You will see a
                  verified badge once approved.
                </p>
              </div>
            )}

            {status === "verified" && (
              <div className="text-center rounded-lg bg-green-900/20 p-4 border border-green-700/30">
                <p className="text-xl font-bold text-green-400">
                  ✅ Account Verified
                </p>
                <p className="mt-2 text-sm text-gray-400">
                  You now have full access to all seller features and your
                  listings will show a verified badge.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

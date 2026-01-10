// app/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Header } from "@/components/Header";
import { ImageUploader } from "@/components/ImageUploader";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [idCardFile, setIdCardFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
        return;
      }

      // Fetch the user's profile from our new 'profiles' table
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile(data);
      } else if (error) {
        console.error("Error fetching profile:", error);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [router, supabase]);

  const handleSubmitVerification = async () => {
    if (!idCardFile) {
      alert("Please select an ID card image to upload.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload the ID card image to a new storage bucket
      const fileExt = idCardFile.name.split(".").pop();
      const filePath = `id-cards/${profile.id}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("verification-documents") // We will create this bucket next
        .upload(filePath, idCardFile, { upsert: true }); // 'upsert' allows overwriting

      if (uploadError) throw uploadError;

      // 2. Get the public URL of the uploaded file
      const {
        data: { publicUrl },
      } = supabase.storage
        .from("verification-documents")
        .getPublicUrl(filePath);

      // 3. Update the user's profile with the ID card URL and set status to 'pending'
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          id_card_url: publicUrl,
          verification_status: "pending",
        })
        .eq("id", profile.id);

      if (updateError) throw updateError;

      alert(
        "Verification documents submitted successfully! Please wait for admin approval."
      );
      // Refresh the profile data
      setProfile((prev: any) => ({
        ...prev,
        verification_status: "pending",
        id_card_url: publicUrl,
      }));
    } catch (err: any) {
      alert("Error submitting documents: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#001428] text-center text-white p-12">
        Loading profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#001428] text-center text-white p-12">
        Could not load profile. Please try logging in again.
      </div>
    );
  }

  const statusColors = {
    unverified: "bg-yellow-900/50 text-yellow-300 border-yellow-700",
    pending: "bg-blue-900/50 text-blue-300 border-blue-700",
    verified: "bg-green-900/50 text-green-300 border-green-700",
  };
  const status = profile.verification_status;

  return (
    <div className="min-h-screen bg-[#001428] text-[#e6f9ff]">
      <div className="mx-auto max-w-6xl px-4 pb-16">
        <Header />
        <div className="mx-auto mt-12 max-w-lg">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl">
            <h1 className="text-2xl font-bold">My Profile</h1>
            <p className="mt-4">Email: {profile.id}</p>
            <div className="mt-4 flex items-center gap-2">
              <p>Verification Status:</p>
              <span
                className={`px-3 py-1 text-sm font-semibold rounded-full border ${
                  statusColors[status] || ""
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>

            <hr className="my-8 border-white/10" />

            {status === "unverified" && (
              <div>
                <h2 className="text-lg font-semibold">
                  Submit for Verification
                </h2>
                <p className="mt-2 text-sm text-gray-400">
                  Please upload a clear photo of your student ID card to get a
                  "Verified" badge on your listings.
                </p>
                <div className="mt-4">
                  <ImageUploader onFileSelect={(file) => setIdCardFile(file)} />
                </div>
                <button
                  onClick={handleSubmitVerification}
                  disabled={isSubmitting || !idCardFile}
                  className="mt-6 w-full rounded-lg bg-gradient-to-r from-[#00d4ff] to-[#8A6CFF] py-3 font-bold text-[#041322] disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit ID for Review"}
                </button>
              </div>
            )}

            {status === "pending" && (
              <div className="text-center">
                <p>Your ID card has been submitted for review.</p>
                <p className="text-sm text-gray-400">
                  Please allow 24-48 hours for an admin to approve your account.
                </p>
              </div>
            )}

            {status === "verified" && (
              <div className="text-center">
                <p className="text-xl font-bold text-green-400">
                  ✅ Your account is verified!
                </p>
                <p className="mt-2 text-sm text-gray-400">
                  A "Verified" badge will now appear on your profile and
                  listings.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

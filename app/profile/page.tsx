// app/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import HeaderClient from "@/components/HeaderClient";
import { ImageUploader } from "@/components/ImageUploader";
import { useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";

// Your types are perfect
type ProfileStatus = "unverified" | "pending" | "verified";
type Profile = {
  id: string;
  full_name: string | null;
  verification_status: ProfileStatus;
  id_card_url: string | null;
};

export default function ProfilePage() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [idCardFile, setIdCardFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
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

      if (data) setProfile(data);
      else if (error) console.error("Error fetching profile:", error);

      setLoading(false);
    };
    fetchInitialData();
  }, [router, supabase]);

  const handleSubmitVerification = async () => {
    if (!idCardFile || !profile) {
      alert("Please select an ID card image to upload.");
      return;
    }
    setIsSubmitting(true);
    try {
      const fileExt = idCardFile.name.split(".").pop();
      const filePath = `${profile.id}/student_id.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("verification-documents")
        .upload(filePath, idCardFile, { upsert: true });
      if (uploadError) throw uploadError;
      const {
        data: { publicUrl },
      } = supabase.storage
        .from("verification-documents")
        .getPublicUrl(filePath);
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ id_card_url: publicUrl, verification_status: "pending" })
        .eq("id", profile.id);
      if (updateError) throw updateError;
      alert(
        "Verification documents submitted successfully! Please wait for admin approval."
      );
      setProfile((prev) =>
        prev
          ? { ...prev, verification_status: "pending", id_card_url: publicUrl }
          : null
      );
    } catch (err: any) {
      alert("Error submitting documents: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#001428] text-center p-8">
        <HeaderClient session={session} />
        <p className="mt-20">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#001428] text-center p-8">
        <HeaderClient session={session} />
        <p className="mt-20">
          Could not load profile. A profile may not have been created for your
          user yet. Please try logging out and signing up again.
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

            {/* THIS IS THE ONLY LINE THAT CHANGED */}
            <p className="mt-4">Email: {session?.user?.email}</p>

            <div className="mt-4 flex items-center gap-2">
              <p>Verification Status:</p>
              <span
                className={`px-3 py-1 text-sm font-semibold rounded-full border ${statusColors[status]}`}
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
                  className="mt-6 w-full rounded-lg bg-gradient-to-r from-[#00d4ff] to-[#8A6CFF] py-3 font-bold text-[#041322] disabled:opacity-50 cursor-pointer"
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

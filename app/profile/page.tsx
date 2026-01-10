// app/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import HeaderClient from "@/components/HeaderClient"; // 1. IMPORT THE CLIENT HEADER
import { ImageUploader } from "@/components/ImageUploader";
import { useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js"; // Import the Session type

// Your Profile/Status types are perfect
type ProfileStatus = "unverified" | "pending" | "verified";
type Profile = {
  id: string;
  full_name: string | null;
  verification_status: ProfileStatus;
  id_card_url: string | null;
};

export default function ProfilePage() {
  const [session, setSession] = useState<Session | null>(null); // 2. ADD STATE FOR THE SESSION
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

      // 3. FETCH BOTH THE SESSION AND THE USER
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session); // Store the session in state

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
      } else if (error) {
        console.error("Error fetching profile:", error);
      }
      setLoading(false);
    };

    fetchInitialData();
  }, [router, supabase]);

  // Your handleSubmitVerification function is perfect and needs no changes.
  const handleSubmitVerification = async () => {
    /* ... */
  };

  // Your loading and !profile checks are perfect.
  if (loading) {
    /* ... */
  }
  if (!profile) {
    /* ... */
  }

  const statusColors: Record<ProfileStatus, string> = {
    /* ... */
  };
  const status = profile.verification_status;

  return (
    <div className="min-h-screen bg-[#001428] text-[#e6f9ff]">
      <div className="mx-auto max-w-6xl px-4 pb-16">
        {/* 4. USE THE CLIENT HEADER AND PASS THE SESSION PROP */}
        <HeaderClient session={session} />

        <div className="mx-auto mt-12 max-w-lg">
          {/* All the rest of your JSX for the profile page is perfect */}
          {/* ... */}
        </div>
      </div>
    </div>
  );
}

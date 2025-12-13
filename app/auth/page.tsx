// app/auth/page.tsx

"use client";

import { useState } from "react";
// import { supabase } from '@/lib/supabaseClient'; // 1. DELETE THIS LINE
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"; // 2. ADD THIS NEW IMPORT
import { Header } from "@/components/Header";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isSigningUp, setIsSigningUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient(); // 3. CREATE THE CLIENT HERE

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (isSigningUp) {
        // Sign Up
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            // This tells Supabase where to redirect the user after they click the confirmation link in their email
            emailRedirectTo: `${location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        alert("Success! Please check your email to confirm your account.");
      } else {
        // Sign In
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        // Redirect to homepage after successful login
        router.push("/");
        router.refresh(); // This ensures the page re-renders with the user logged in
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  // ... the rest of the file (the JSX for the form) is exactly the same ...
  return (
    <div className="min-h-screen bg-[#001428] text-[#e6f9ff]">
      <div className="mx-auto max-w-6xl px-4 pb-16">
        <Header />
        <div className="mx-auto mt-20 max-w-md">
          {/* ... form JSX here ... */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl">
            <h2 className="text-center text-2xl font-bold">
              {isSigningUp ? "Create Your Account" : "Sign In to Homie"}
            </h2>

            <form onSubmit={handleAuth} className="mt-8 space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-bold text-[#bcdff0]"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-lg border-none bg-white/5 px-4 py-3 text-white outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="text-sm font-bold text-[#bcdff0]"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 w-full rounded-lg border-none bg-white/5 px-4 py-3 text-white outline-none"
                />
              </div>

              {error && (
                <p className="text-center text-sm text-red-400">{error}</p>
              )}

              <div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-gradient-to-r from-[#00d4ff] to-[#8A6CFF] py-3 font-bold text-[#041322]"
                >
                  {isSigningUp ? "Sign Up" : "Sign In"}
                </button>
              </div>
            </form>

            <p className="mt-6 text-center text-sm">
              {isSigningUp
                ? "Already have an account?"
                : "Don't have an account?"}
              <button
                onClick={() => setIsSigningUp(!isSigningUp)}
                className="ml-2 font-bold text-[#00d4ff] hover:underline"
              >
                {isSigningUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

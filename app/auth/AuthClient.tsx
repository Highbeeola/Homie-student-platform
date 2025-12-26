// app/auth/AuthClient.tsx
"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr"; // <-- 1. THE NEW, CORRECT IMPORT
import { Header } from "@/components/Header"; // Assuming your Header is a Server Component, this might need adjustment later
import { useRouter } from "next/navigation";

export default function AuthClient() {
  const [isSigningUp, setIsSigningUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [emailRedirectTo, setEmailRedirectTo] = useState("");
  const router = useRouter();

  // 2. THE NEW, CORRECT WAY TO CREATE THE CLIENT
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    setEmailRedirectTo(`${window.location.origin}/auth/callback`);
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (isSigningUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: emailRedirectTo },
        });
        if (error) throw error;
        alert("Success! Please check your email to confirm your account.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#001428] text-[#e6f9ff]">
      {/* Note: If Header is a server component, this will cause an error. We may need a HeaderClient. */}
      {/* For now, let's see if it works. */}
      {/* <Header />  <-- Temporarily comment this out if it causes issues */}
      <div className="mx-auto mt-20 max-w-md">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl">
          <h2 className="text-center text-2xl font-bold">
            {isSigningUp ? "Create Your Account" : "Sign In to Homie"}
          </h2>
          <form onSubmit={handleAuth} className="mt-8 space-y-6">
            {/* ... your form JSX is perfect, no changes needed ... */}
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
  );
}

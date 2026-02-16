"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import HeaderClient from "@/components/HeaderClient";
import type { Session } from "@supabase/supabase-js";

export default function AuthClient() {
  const [session, setSession] = useState<Session | null>(null);
  const [isSigningUp, setIsSigningUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      if (session) {
        router.push("/");
      }
    };
    checkSession();
  }, [router, supabase]);

  // ✅ HELPER: Generates a safe URL including https://
  const getURL = () => {
    let url = window.location.origin;
    // Make sure it includes the protocol
    if (!url.startsWith("http")) {
      url = `https://${url}`;
    }
    return `${url}/auth/callback`;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Use the safe URL helper
    const redirectUrl = getURL();

    if (isSigningUp) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: redirectUrl }, // ✅ Fixed
      });
      if (error) {
        setError(error.message);
        return;
      }
      if (
        data.user &&
        data.user.identities &&
        data.user.identities.length === 0
      ) {
        setError("This email may already be in use. Please sign in.");
      } else {
        alert("Success! Please check your email to confirm your account.");
        setEmail("");
        setPassword("");
        setIsSigningUp(false);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
        return;
      }
      router.push("/");
    }
  };

  const handleGoogleSignIn = async () => {
    // Use the safe URL helper
    const redirectUrl = getURL();

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl, // ✅ Fixed
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#001428] text-[#e6f9ff]">
      <div className="mx-auto max-w-6xl px-4">
        {/* Pass session to Header to avoid double-fetching */}
        <HeaderClient session={session} />
      </div>
      <div className="mx-auto mt-20 max-w-md px-4 pb-16">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl">
          <h2 className="text-center text-2xl font-bold">
            {isSigningUp ? "Create Your Account" : "Sign In to Homie"}
          </h2>

          {/* GOOGLE BUTTON */}
          <button
            onClick={handleGoogleSignIn}
            className="mt-6 w-full flex items-center justify-center gap-3 rounded-lg border border-white/20 bg-white/10 py-3 font-semibold text-white transition-colors hover:bg-white/20"
          >
            <svg className="h-5 w-5" viewBox="0 0 48 48">
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              ></path>
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              ></path>
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.022,35.244,44,30.038,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
            </svg>
            <span>
              {isSigningUp ? "Sign Up with Google" : "Sign In with Google"}
            </span>
          </button>

          <div className="my-6 flex items-center gap-4">
            <hr className="w-full border-t border-white/20" />
            <span className="text-sm text-gray-400">OR</span>
            <hr className="w-full border-t border-white/20" />
          </div>

          {/* EMAIL/PASSWORD FORM */}
          <form onSubmit={handleAuth} className="space-y-6">
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
                className="mt-2 w-full rounded-lg border-none bg-white/10 px-4 py-3 text-white outline-none"
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
                className="mt-2 w-full rounded-lg border-none bg-white/10 px-4 py-3 text-white outline-none"
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

          {/* TOGGLE */}
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

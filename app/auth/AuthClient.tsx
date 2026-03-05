"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function AuthClient() {
  const [session, setSession] = useState<Session | null>(null);

  // Modes: "signin", "signup", "recovery"
  const [view, setView] = useState<"signin" | "signup" | "recovery">("signin");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  // Reset UI when switching view
  useEffect(() => {
    setShowPassword(false);
    setError(null);
    setMessage(null);

    // Optional UX: don’t keep password when leaving signin/signup
    if (view === "recovery") setPassword("");
  }, [view]);

  // If already logged in, go home
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      if (session) router.push("/");
    };
    checkSession();
  }, [router, supabase]);

  const getURL = () => {
    let url = window.location.origin;
    if (!url.startsWith("http")) url = `https://${url}`;
    return url;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);

    try {
      const baseUrl = getURL();

      // --- 1) RECOVERY MODE ---
      if (view === "recovery") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${baseUrl}/auth/update-password`,
        });
        if (error) throw error;

        setMessage("Check your email for the password reset link!");
        return;
      }

      // --- 2) SIGN UP MODE ---
      if (view === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${baseUrl}/auth/callback` },
        });

        if (error) throw error;

        if (data.user?.identities && data.user.identities.length === 0) {
          throw new Error("This email is already in use. Please sign in.");
        }

        alert("Success! Please check your email to confirm your account.");
        setView("signin");
        return;
      }

      // --- 3) SIGN IN MODE ---
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      router.refresh();
      router.push("/");
    } catch (err: any) {
      setError(err.message ?? "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setMessage(null);

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${getURL()}/auth/callback` },
    });
  };

  return (
    <div className="min-h-screen bg-[#001428] text-[#e6f9ff]">
      <div className="mx-auto mt-20 max-w-md px-4 pb-16">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl">
          <h2 className="mb-6 text-center text-2xl font-bold">
            {view === "signup" && "Create Account"}
            {view === "signin" && "Sign In to Homie"}
            {view === "recovery" && "Reset Password"}
          </h2>

          {/* Social Login (Only for Sign In / Sign Up) */}
          {view !== "recovery" && (
            <>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 rounded-lg border border-white/20 bg-white/10 py-3 font-semibold text-white transition-colors hover:bg-white/20"
              >
                <svg className="h-5 w-5" viewBox="0 0 48 48">
                  <path
                    fill="#FFC107"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.022,35.244,44,30.038,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="my-6 flex items-center gap-4">
                <hr className="w-full border-t border-white/20" />
                <span className="text-sm text-gray-400">OR</span>
                <hr className="w-full border-t border-white/20" />
              </div>
            </>
          )}

          <form onSubmit={handleAuth} className="space-y-6">
            {/* Email */}
            <div>
              <label className="text-sm font-bold text-[#bcdff0]">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-lg border-none bg-white/10 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-[#00d4ff]"
              />
            </div>

            {/* Password + Forgot Password UNDER input */}
            {view !== "recovery" && (
              <div>
                <label className="text-sm font-bold text-[#bcdff0]">
                  Password
                </label>

                <div className="relative mt-2">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border-none bg-white/10 px-4 py-3 pr-12 text-white outline-none focus:ring-2 focus:ring-[#00d4ff]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* ✅ MOVED HERE: under textbox */}
                {view === "signin" && (
                  <button
                    type="button"
                    onClick={() => setView("recovery")}
                    className="mt-2 text-xs text-[#00d4ff] hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
            )}

            {error && (
              <p className="text-center text-sm text-red-400 bg-red-500/10 p-2 rounded">
                {error}
              </p>
            )}
            {message && (
              <p className="text-center text-sm text-green-400 bg-green-500/10 p-2 rounded">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-gradient-to-r from-[#00d4ff] to-[#8A6CFF] py-3 font-bold text-[#041322] disabled:opacity-50 transition-transform hover:scale-[1.02]"
            >
              {isLoading
                ? "Processing..."
                : view === "recovery"
                  ? "Send Reset Link"
                  : view === "signup"
                    ? "Sign Up"
                    : "Sign In"}
            </button>
          </form>

          {/* Bottom Toggle */}
          <div className="mt-6 text-center text-sm">
            {view === "recovery" ? (
              <button
                type="button"
                onClick={() => setView("signin")}
                className="flex items-center justify-center gap-2 mx-auto text-gray-400 hover:text-white"
              >
                <ArrowLeft size={14} /> Back to Sign In
              </button>
            ) : (
              <p>
                {view === "signup"
                  ? "Already have an account?"
                  : "Don't have an account?"}
                <button
                  type="button"
                  onClick={() =>
                    setView(view === "signup" ? "signin" : "signup")
                  }
                  className="ml-2 font-bold text-[#00d4ff] hover:underline"
                >
                  {view === "signup" ? "Sign In" : "Sign Up"}
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

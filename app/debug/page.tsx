import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function DebugPage() {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-black text-white p-8 font-mono text-sm">
      <h1 className="text-2xl font-bold text-red-500 mb-4">Server Debugger</h1>

      <div className="mb-8 border border-white/20 p-4 rounded">
        <h2 className="text-xl font-bold mb-2">1. Auth Status</h2>
        <p>User Found: {user ? "✅ YES" : "❌ NO"}</p>
        <p>User Email: {user?.email || "N/A"}</p>
        <p>User ID: {user?.id || "N/A"}</p>
        {error && <p className="text-red-400">Error: {error.message}</p>}
      </div>

      <div className="mb-8 border border-white/20 p-4 rounded">
        <h2 className="text-xl font-bold mb-2">
          2. Cookies Received by Server
        </h2>
        <p className="text-gray-400 mb-2">Total Cookies: {allCookies.length}</p>
        <ul className="list-disc pl-5">
          {allCookies.map((c) => (
            <li key={c.name} className="break-all">
              <span className="text-blue-400">{c.name}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-8 border border-white/20 p-4 rounded">
        <h2 className="text-xl font-bold mb-2">3. Environment Check</h2>
        <p>
          Supabase URL:{" "}
          {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing"}
        </p>
        <p>
          Anon Key:{" "}
          {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing"}
        </p>
      </div>
    </div>
  );
}

import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import Link from "next/link";

// ⚠️ SECURITY: Only these emails can access /admin/*
// REPLACE THIS with your actual login email
const ADMIN_EMAILS = [
  "ibrahimoladehinde1@gmail.com",
  "monsuratoladehinde69@gmail.com",
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();

  // 1. Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 2. Security Check
  // If not logged in OR email not in the list -> Kick them out to Home
  if (!user || !user.email || !ADMIN_EMAILS.includes(user.email)) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-[#041322] text-white">
      {/* --- Sidebar --- */}
      <aside className="fixed left-0 top-0 h-full w-64 border-r border-white/10 bg-[#041322] p-6 flex flex-col z-50">
        <div className="mb-10 flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#00d4ff] to-blue-600" />
          <span className="text-xl font-bold tracking-tight">Homie Admin</span>
        </div>

        <nav className="space-y-2 flex-1">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-gray-400 hover:text-[#00d4ff] transition-all font-medium"
          >
            📊 Dashboard
          </Link>
          <Link
            href="/admin/verify"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-gray-400 hover:text-[#00d4ff] transition-all font-medium"
          >
            📋 User Verifications
          </Link>
          <Link
            href="/admin/listings"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-gray-400 hover:text-[#00d4ff] transition-all font-medium"
          >
            🏠 Manage Listings
          </Link>
        </nav>

        <div className="pt-6 border-t border-white/10">
          <p className="text-xs text-gray-600 uppercase font-bold mb-2">
            Logged in as
          </p>
          <p className="text-xs text-[#00d4ff] truncate">{user.email}</p>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  );
}

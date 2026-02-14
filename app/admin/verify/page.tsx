import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { AdminActions } from "@/components/AdminActions";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function VerifyPage() {
  const supabase = await createSupabaseServerClient();

  // 1. Fetch profiles (Security is handled by RLS policies we ran earlier)
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("verification_status", "pending")
    .not("id_card_url", "is", null); // Don't show users who haven't uploaded an ID

  if (error) {
    return <div className="text-red-400 p-8">Error: {error.message}</div>;
  }

  return (
    <div className="bg-[#041322] text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-2 text-[#00d4ff]">
        Pending Verifications
      </h1>
      <p className="mb-8 text-gray-400">
        Review student IDs and approve accounts.
      </p>

      <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-white/5">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#bcdff0]">
                User Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#bcdff0]">
                ID Card
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#bcdff0]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {profiles && profiles.length > 0 ? (
              profiles.map((profile) => (
                <tr
                  key={profile.id}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-white">
                        {profile.full_name || "Unknown"}
                      </span>
                      <span className="text-sm text-gray-400">
                        {profile.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {profile.id_card_url ? (
                      <a
                        href={profile.id_card_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#00d4ff] hover:underline text-sm"
                      >
                        📄 View ID Image
                      </a>
                    ) : (
                      <span className="text-gray-500 text-sm">
                        No ID Uploaded
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <AdminActions userId={profile.id} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  ✅ No pending verifications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

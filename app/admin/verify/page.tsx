import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { AdminActions } from "@/components/AdminActions";

export const dynamic = "force-dynamic";

export default async function VerifyPage() {
  const supabase = await createSupabaseServerClient();

  // 1. Fetch ALL profiles
  // We order by verification_status so 'pending' usually comes up,
  // or we can sort by created_at.
  // A clean trick: Order by verification_status descending puts 'verified'/'unverified' apart from 'pending'.
  // Let's just fetch all and sort in JS or simple SQL order.
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error)
    return <div className="text-red-400 p-8">Error: {error.message}</div>;

  // 2. Sort Manually: Pending first, then Verified, then others
  const sortedProfiles = profiles?.sort((a, b) => {
    const score = (status: string) => {
      if (status === "pending") return 3;
      if (status === "verified") return 2;
      return 1;
    };
    return score(b.verification_status) - score(a.verification_status);
  });

  return (
    <div className="bg-[#041322] text-white min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#00d4ff]">User Management</h1>
          <p className="text-gray-400">
            Verify, Reject, or Revoke user statuses.
          </p>
        </div>
        <div className="text-sm font-mono bg-white/5 px-3 py-1 rounded border border-white/10">
          Total Users: {profiles?.length || 0}
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-black/20">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#bcdff0]">
                User
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#bcdff0]">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#bcdff0]">
                ID Document
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#bcdff0]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {sortedProfiles?.map((profile) => (
              <tr
                key={profile.id}
                className="hover:bg-white/5 transition-colors"
              >
                {/* User Info */}
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-white text-base">
                      {profile.full_name || "Unknown Name"}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">
                      {profile.email}
                    </span>
                    <span className="text-xs text-gray-500">
                      {profile.phone_number || "No Phone"}
                    </span>
                  </div>
                </td>

                {/* Status Badge */}
                <td className="px-6 py-4">
                  <StatusBadge status={profile.verification_status} />
                </td>

                {/* ID Card Link */}
                <td className="px-6 py-4">
                  {profile.id_card_url ? (
                    <a
                      href={profile.id_card_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-400 hover:bg-blue-500 hover:text-white transition-all"
                    >
                      <span>📄 View ID</span>
                    </a>
                  ) : (
                    <span className="text-xs text-gray-600 italic">
                      No ID uploaded
                    </span>
                  )}
                </td>

                {/* Dynamic Actions */}
                <td className="px-6 py-4">
                  <AdminActions
                    userId={profile.id}
                    currentStatus={profile.verification_status || "unverified"}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Small helper component for the badge color
function StatusBadge({ status }: { status: string }) {
  const styles = {
    verified: "bg-green-500/20 text-green-400 border-green-500/30",
    pending: "bg-blue-500/20 text-blue-400 border-blue-500/30 animate-pulse",
    rejected: "bg-red-500/20 text-red-400 border-red-500/30",
    unverified: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  };
  const key = (status || "unverified") as keyof typeof styles;

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${styles[key] || styles.unverified}`}
    >
      {status || "Unverified"}
    </span>
  );
}

// app/admin/page.tsx
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import type { Profile } from '@/types/profile';
import { AdminActions } from './AdminActions';
import { headers } from 'next/headers';

export default async function AdminPage() {
  const headersList = await headers(); // get the headers object
  const authHeader = headersList.get('authorization');
  const expectedPassword = process.env.ADMIN_PASSWORD;

  // Simple password check. NOTE: In a real app, use a proper auth system.
  if (process.env.NODE_ENV === 'production' && (!expectedPassword || authHeader !== `Bearer ${expectedPassword}`)) {
    throw new Response('Unauthorized', { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' } });
  }

  const supabase = await createSupabaseServerClient();
  const { data: pendingProfiles, error } = await supabase
    .from('profiles')
    .select<"*", Profile>('*')
    .eq('verification_status', 'pending');

  if (error) {
    console.error("Error fetching pending profiles:", error);
    return <div>Error loading data.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold">Admin Verification Portal</h1>
      <p className="mt-2 text-gray-400">Review and approve pending student verifications.</p>
      <div className="mt-8 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">User Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID Card</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {pendingProfiles && pendingProfiles.length > 0 ? (
              pendingProfiles.map((profile) => (
                <tr key={profile.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{profile.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {profile.id_card_url ? (
                      <a href={profile.id_card_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">View ID</a>
                    ) : (
                      <span className="text-gray-500">No ID</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap"><AdminActions userId={profile.id} /></td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={3} className="px-6 py-4 text-center text-gray-500">No pending verifications.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
// types/profile.ts
export type ProfileStatus = "unverified" | "pending" | "verified";

export type Profile = {
  id: string;
  full_name: string | null;
  verification_status: ProfileStatus;
  id_card_url: string | null;
  // You might need to add other columns from your 'profiles' table here later
};

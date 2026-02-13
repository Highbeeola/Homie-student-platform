// types/listing.ts
export type Listing = {
  id: number | string;
  created_at?: string;
  title?: string;
  price?: number;
  location?: string;
  rooms?: string;
  description?: string;
  image_url?: string;
  user_id?: string;
  video_url?: string;
  image_url_2?: string;
  image_url_3?: string;
  contact_phone?: string | null;
  capacity?: number;
  occupants_gender?: string | null;
  spots_filled?: number;
};

export default Listing;

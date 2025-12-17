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
};

export default Listing;

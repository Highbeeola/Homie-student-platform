// app/actions/cloudinary.ts
"use server";

import cloudinary from "@/lib/cloudinary"; // Import the configured client

// This is the secure action the VideoUploader will call
export async function getUploadSignature() {
  const timestamp = Math.round(new Date().getTime() / 1000);

  // This uses your secret key on the server to create a temporary, secure signature
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp,
      folder: "homie-videos",
    },
    process.env.CLOUDINARY_API_SECRET!,
  );

  return { timestamp, signature };
}

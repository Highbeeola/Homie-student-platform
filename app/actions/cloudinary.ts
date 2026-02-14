// app/actions/cloudinary.ts
"use server";

import cloudinary from "@/lib/cloudinary";

export async function getUploadSignature() {
  const timestamp = Math.round(new Date().getTime() / 1000);

  // 1. Define the parameters to sign
  const paramsToSign = {
    timestamp: timestamp,
    folder: "homie-videos", // precise folder name
  };

  // 2. Generate signature using the PRIVATE secret
  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!,
  );

  return { timestamp, signature };
}

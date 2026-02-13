// components/VideoUploader.tsx
"use client";

import { useState } from "react";
import { getUploadSignature } from "@/actions/cloudinary"; // The server action we created

type VideoUploaderProps = {
  onUpload: (url: string) => void;
};

export function VideoUploader({ onUpload }: VideoUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];

    // Check file size (e.g., limit to 100MB)
    if (file.size > 100 * 1024 * 1024) {
      alert("File is too large. Please upload a video under 100MB.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadedUrl(null);

    try {
      // 1. Get the secure signature from our server action
      const { timestamp, signature } = await getUploadSignature();

      // 2. Prepare the form data to send to Cloudinary's API
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
      formData.append("signature", signature);
      formData.append("timestamp", timestamp.toString());
      formData.append("folder", "homie-videos"); // The folder we specified in the action

      // 3. Use XMLHttpRequest to get real-time upload progress
      const xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!}/video/upload`,
      );

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round(
            (event.loaded / event.total) * 100,
          );
          setUploadProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          const secureUrl = response.secure_url;
          setUploadedUrl(secureUrl);
          onUpload(secureUrl); // Pass the final URL back to the parent form
          setIsUploading(false);
        } else {
          throw new Error("Upload failed. Please try again.");
        }
      };

      xhr.onerror = () => {
        throw new Error("An error occurred during the upload.");
      };

      xhr.send(formData);
    } catch (error: any) {
      alert(error.message);
      setIsUploading(false);
    }
  };

  return (
    <div className="rounded-lg border border-dashed border-gray-600 p-4">
      <label htmlFor="video-upload" className="cursor-pointer text-center">
        <div className="flex flex-col items-center">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.55a2 2 0 01.9 1.54V15a2 2 0 01-2 2H5a2 2 0 01-2-2v-3.46a2 2 0 01.9-1.54L8 10m7 0l-3.5-3.5L10 10m4 0v10"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-300">Click to upload a video</p>
          <p className="text-xs text-gray-500">(MP4, MOV, max 100MB)</p>
        </div>
      </label>
      <input
        id="video-upload"
        type="file"
        accept="video/mp4,video/quicktime,video/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />
      {isUploading && (
        <div className="mt-4 w-full bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-blue-500 h-2.5 rounded-full"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}
      {uploadedUrl && !isUploading && (
        <p className="mt-4 text-center text-sm text-green-400">
          ✅ Video uploaded successfully!
        </p>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { getUploadSignature } from "@/app/actions/cloudinary";

type VideoUploaderProps = {
  onUpload: (url: string) => void;
};

export function VideoUploader({ onUpload }: VideoUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];

    // Check file size (limit to 100MB)
    if (file.size > 100 * 1024 * 1024) {
      alert("File is too large. Please upload a video under 100MB.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadedUrl(null);
    setError(null);

    try {
      // 1. Get the secure signature from our server action
      const { timestamp, signature } = await getUploadSignature();

      // 2. Prepare the form data
      const formData = new FormData();
      formData.append("file", file);

      // ✅ FIX 1: Using the Public API Key
      formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);

      formData.append("signature", signature);
      formData.append("timestamp", timestamp.toString());

      // ✅ FIX 2: Matching the folder from your Server Action
      formData.append("folder", "homie-videos");

      // 3. Use XMLHttpRequest
      const xhr = new XMLHttpRequest();
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;

      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
      );

      // Track Progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round(
            (event.loaded / event.total) * 100,
          );
          setUploadProgress(percentComplete);
        }
      };

      // Handle Response
      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          const secureUrl = response.secure_url;

          setUploadedUrl(secureUrl);
          onUpload(secureUrl); // Pass URL to parent form
          setIsUploading(false);
        } else {
          console.error("Cloudinary Error Details:", xhr.responseText);
          const errorResponse = JSON.parse(xhr.responseText || "{}");
          const errorMessage =
            errorResponse.error?.message || "Upload failed. Check console.";

          setError(errorMessage);
          setIsUploading(false);
        }
      };

      xhr.onerror = () => {
        setError("Network error occurred during upload.");
        setIsUploading(false);
      };

      xhr.send(formData);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setIsUploading(false);
    }
  };

  return (
    <div className="rounded-lg border border-dashed border-gray-600 p-4 bg-white/5 transition-all hover:bg-white/10">
      <label
        htmlFor="video-upload"
        className="cursor-pointer block w-full h-full"
      >
        <div className="flex flex-col items-center justify-center py-4">
          {/* Change Icon based on upload status */}
          {!uploadedUrl ? (
            <svg
              className={`w-12 h-12 mb-2 ${isUploading ? "text-blue-400 animate-bounce" : "text-gray-400"}`}
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
          ) : (
            <div className="mb-2 rounded bg-green-500/20 p-2">
              <span className="text-2xl">🎬</span>
            </div>
          )}

          <p className="text-sm text-gray-300 font-medium text-center">
            {isUploading
              ? `Uploading... ${uploadProgress}%`
              : uploadedUrl
                ? "Video Tour Ready"
                : "Click to upload video tour"}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {uploadedUrl
              ? "Click again to replace video"
              : "(MP4, MOV, max 100MB)"}
          </p>
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

      {/* Progress Bar */}
      {isUploading && (
        <div className="mt-4 w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}

      {/* Video Preview - Very helpful for the user! */}
      {uploadedUrl && !isUploading && (
        <div className="mt-4 relative rounded-lg overflow-hidden border border-white/10 aspect-video">
          <video
            src={uploadedUrl}
            controls
            className="w-full h-full object-cover bg-black"
          />
        </div>
      )}

      {error && (
        <div className="mt-4 p-2 bg-red-500/20 border border-red-500/30 rounded text-center">
          <p className="text-sm text-red-400 font-bold">❌ {error}</p>
        </div>
      )}
    </div>
  );
}

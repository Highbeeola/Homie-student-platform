// components/ImageUploader.tsx
"use client";

import { useState, useEffect } from "react";

type ImageUploaderProps = {
  // It now passes the raw file object back to the parent
  onFileSelect: (file: File | null) => void;
  initialImageUrl?: string | null;
};

export function ImageUploader({
  onFileSelect,
  initialImageUrl,
}: ImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialImageUrl || null
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      // Show a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Pass the selected file back to the parent form
      onFileSelect(file);
    } else {
      // If the user cancels the file selection
      onFileSelect(null);
    }
  };

  return (
    <div>
      {previewUrl ? (
        <img
          src={previewUrl}
          alt="Image preview"
          className="h-48 w-full rounded-lg object-cover"
        />
      ) : (
        <div className="flex h-48 w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-600">
          <span className="text-gray-400">Image Preview</span>
        </div>
      )}
      <div className="mt-4">
        <label
          htmlFor="image-upload"
          className="cursor-pointer rounded-lg bg-white/10 px-4 py-2 font-semibold text-white transition-colors hover:bg-white/20"
        >
          Choose Image
        </label>
        <input
          style={{ visibility: "hidden", position: "absolute" }}
          type="file"
          id="image-upload"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}

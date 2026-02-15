"use client";

import { useState, useId } from "react";
import Image from "next/image";
import { X } from "lucide-react";

type ImageUploaderProps = {
  initialImageUrl?: string | null;
  onFileSelect: (file: File | null) => void;
};

export function ImageUploader({
  initialImageUrl,
  onFileSelect,
}: ImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialImageUrl || null,
  );

  const id = useId();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreviewUrl(URL.createObjectURL(file));
      onFileSelect(file);
    } else {
      onFileSelect(null);
    }
  };

  const removeImage = () => {
    setPreviewUrl(null);
    onFileSelect(null);
  };

  return (
    <div className="w-full">
      {/* Preview Area */}
      <div className="relative h-48 w-full overflow-hidden rounded-lg border border-dashed border-white/20 bg-white/5">
        {previewUrl ? (
          <>
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white hover:bg-red-500"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[#bcdff0]">
            Image Preview
          </div>
        )}
      </div>

      {/* Button Section */}
      <div className="mt-4 flex justify-center sm:justify-start">
        <label
          htmlFor={id}
          className="cursor-pointer rounded-lg bg-gradient-to-r from-[#00d4ff] to-[#8A6CFF] px-6 py-2 text-sm font-semibold text-[#041322] transition hover:opacity-90"
        >
          Choose Image
        </label>
        <input
          id={id}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}

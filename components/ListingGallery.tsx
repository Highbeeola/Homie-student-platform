"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Grid } from "lucide-react"; // Ensure lucide-react is installed

type GalleryProps = {
  images: string[];
};

export function ListingGallery({ images }: GalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  // Filter out empty strings just in case
  const validImages = images.filter(Boolean);

  const openGallery = (index: number) => {
    setPhotoIndex(index);
    setIsOpen(true);
  };

  const nextPhoto = () => {
    setPhotoIndex((prev) => (prev + 1) % validImages.length);
  };

  const prevPhoto = () => {
    setPhotoIndex(
      (prev) => (prev - 1 + validImages.length) % validImages.length,
    );
  };

  if (validImages.length === 0) return null;

  return (
    <>
      {/* --- 1. The Desktop/Mobile Grid Layout --- */}
      <div className="relative overflow-hidden rounded-2xl">
        <div className="grid h-[300px] md:h-[400px] grid-cols-1 md:grid-cols-4 gap-2">
          {/* Main Image (Takes half space on desktop) */}
          <div
            className="relative md:col-span-2 md:row-span-2 cursor-pointer group"
            onClick={() => openGallery(0)}
          >
            <Image
              src={validImages[0]}
              alt="Main"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </div>

          {/* Secondary Images (Hidden on mobile usually, or stacked) */}
          <div className="hidden md:grid md:col-span-1 md:row-span-2 gap-2">
            {validImages[1] && (
              <div
                className="relative h-full cursor-pointer group"
                onClick={() => openGallery(1)}
              >
                <Image
                  src={validImages[1]}
                  alt="Img 2"
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
            )}
            {validImages[2] && (
              <div
                className="relative h-full cursor-pointer group"
                onClick={() => openGallery(2)}
              >
                <Image
                  src={validImages[2]}
                  alt="Img 3"
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
            )}
          </div>

          {/* "View All" Button Overlay */}
          <button
            onClick={() => openGallery(0)}
            className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/90 text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-white shadow-lg transition-all"
          >
            <Grid size={16} />
            Show all photos
          </button>
        </div>
      </div>

      {/* --- 2. The Full Screen Modal --- */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm">
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 p-2 text-white/70 hover:text-white bg-white/10 rounded-full"
          >
            <X size={32} />
          </button>

          {/* Navigation Buttons */}
          {validImages.length > 1 && (
            <>
              <button
                onClick={prevPhoto}
                className="absolute left-4 p-3 text-white bg-black/50 rounded-full hover:bg-black/80"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                onClick={nextPhoto}
                className="absolute right-4 p-3 text-white bg-black/50 rounded-full hover:bg-black/80"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}

          {/* Main Image View */}
          <div className="relative h-[80vh] w-[90vw] max-w-5xl">
            <Image
              src={validImages[photoIndex]}
              alt="Full View"
              fill
              className="object-contain"
            />
          </div>

          {/* Counter */}
          <div className="absolute bottom-6 text-white/50 text-sm">
            Image {photoIndex + 1} of {validImages.length}
          </div>
        </div>
      )}
    </>
  );
}

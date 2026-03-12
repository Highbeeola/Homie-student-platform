"use client";

import { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";

export function SaveButton({ listingId }: { listingId: string | number }) {
  const [isSaved, setIsSaved] = useState(false);

  // Check if it's already saved when the page loads
  useEffect(() => {
    const savedListings = JSON.parse(
      localStorage.getItem("homie_saved") || "[]",
    );
    if (savedListings.includes(listingId)) {
      setIsSaved(true);
    }
  }, [listingId]);

  const toggleSave = () => {
    let savedListings = JSON.parse(localStorage.getItem("homie_saved") || "[]");

    if (isSaved) {
      // Remove it
      savedListings = savedListings.filter((id: any) => id !== listingId);
    } else {
      // Add it
      savedListings.push(listingId);
    }

    localStorage.setItem("homie_saved", JSON.stringify(savedListings));
    setIsSaved(!isSaved);
  };

  return (
    <button
      onClick={toggleSave}
      className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white transition-colors"
    >
      <Bookmark
        size={24}
        className={isSaved ? "fill-[#00d4ff] text-[#00d4ff]" : ""}
      />
      <span className="hidden sm:inline underline">
        {isSaved ? "Saved" : "Save"}
      </span>
    </button>
  );
}

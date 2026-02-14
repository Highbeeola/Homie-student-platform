"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { bookSpotAction } from "@/app/actions/booking";
import type { Listing } from "@/types/listing";
import { User, Users } from "lucide-react"; // Make sure you have icons, or remove if not using lucide-react

export function BookingWidget({ listing }: { listing: Listing }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);

  // State for gender selection if the room is currently empty
  const [selectedGender, setSelectedGender] = useState<"Male" | "Female" | "">(
    "",
  );

  // Logic to check status
  const capacity = listing.capacity || 1;
  const filled = listing.spots_filled || 0;
  const isFull = filled >= capacity;
  const isEmpty = filled === 0;
  const currentOccupantGender = listing.occupants_gender;

  const handleBook = async () => {
    // Validation: If room is empty, user MUST pick a gender
    let genderToSubmit = currentOccupantGender;

    if (isEmpty) {
      if (!selectedGender) {
        setFeedback({
          type: "error",
          message: "Please select your gender to set the room rules.",
        });
        return;
      }
      genderToSubmit = selectedGender; // The first user sets the rule
    }

    setFeedback(null);

    startTransition(async () => {
      try {
        // Call the Server Action
        const result = await bookSpotAction(
          listing.id,
          genderToSubmit as "Male" | "Female",
        );

        if (result.error) {
          setFeedback({ type: "error", message: result.error });
        } else {
          setFeedback({
            type: "success",
            message: "Success! You have booked a spot.",
          });
          router.refresh(); // Refresh page to update the UI numbers
        }
      } catch (err) {
        setFeedback({
          type: "error",
          message: "Something went wrong. Please try again.",
        });
      }
    });
  };

  // 1. If Full
  if (isFull) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
        <h3 className="text-xl font-bold text-red-400">Fully Booked</h3>
        <p className="text-sm text-gray-400 mt-2">
          There are no spots left in this listing.
        </p>
      </div>
    );
  }

  // 2. If Available
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl">
      <h3 className="text-xl font-bold text-white mb-1">
        ₦{listing.price?.toLocaleString()}{" "}
        <span className="text-sm font-normal text-gray-400">/ year</span>
      </h3>

      <div className="my-4 flex items-center gap-2 text-sm text-[#bcdff0]">
        <Users size={16} />
        <span>
          {capacity - filled} of {capacity} spots available
        </span>
      </div>

      <hr className="border-white/10 my-4" />

      {/* Logic: If room is empty, ask for Gender. If not, show required Gender. */}
      {isEmpty ? (
        <div className="mb-4">
          <p className="text-sm text-gray-300 mb-2">
            You are the first occupant. Set the room gender:
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setSelectedGender("Male")}
              className={`flex-1 py-2 rounded-lg border ${selectedGender === "Male" ? "bg-blue-600 border-blue-600 text-white" : "border-white/20 text-gray-400 hover:bg-white/10"}`}
            >
              Male
            </button>
            <button
              type="button"
              onClick={() => setSelectedGender("Female")}
              className={`flex-1 py-2 rounded-lg border ${selectedGender === "Female" ? "bg-pink-600 border-pink-600 text-white" : "border-white/20 text-gray-400 hover:bg-white/10"}`}
            >
              Female
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-sm text-blue-200">
            Current roommates are <strong>{currentOccupantGender}</strong>. You
            must match this gender to book.
          </p>
        </div>
      )}

      {/* Feedback Message */}
      {feedback && (
        <div
          className={`mb-4 p-3 rounded text-sm text-center ${feedback.type === "error" ? "bg-red-500/20 text-red-200" : "bg-green-500/20 text-green-200"}`}
        >
          {feedback.message}
        </div>
      )}

      <button
        onClick={handleBook}
        disabled={isPending}
        className="w-full rounded-lg bg-gradient-to-r from-[#00d4ff] to-[#8A6CFF] py-3 font-bold text-[#041322] hover:opacity-90 disabled:opacity-50 transition-all"
      >
        {isPending ? "Processing..." : "Book This Spot"}
      </button>

      <p className="text-xs text-center text-gray-500 mt-4">
        By clicking "Book", you agree to the house rules.
      </p>
    </div>
  );
}

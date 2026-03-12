"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { bookSpotAction } from "@/app/actions/booking";
import type { Listing } from "@/types/listing";
import { User, Users, Lock, X } from "lucide-react";
import { usePaystackPayment } from "react-paystack"; // ✅ Use the hook instead of the button

export function BookingWidget({
  listing,
  userEmail,
}: {
  listing: Listing;
  userEmail?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);
  const [selectedGender, setSelectedGender] = useState<"Male" | "Female" | "">(
    "",
  );

  // ✅ Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  const capacity = listing.capacity || 1;
  const filled = listing.spots_filled || 0;
  const isFull = filled >= capacity;
  const isEmpty = filled === 0;
  const currentOccupantGender = listing.occupants_gender;

  // Connection Fee (Fixed at N5000 as requested)
  const serviceFee = 5000;

  const paystackConfig = {
    reference: new Date().getTime().toString(),
    email: userEmail || "student@homie.com",
    amount: serviceFee * 100, // Kobo
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
  };

  // ✅ Initialize Paystack Hook
  const initializePayment = usePaystackPayment(paystackConfig);

  const handlePaystackSuccess = (reference: any) => {
    const genderToSubmit = isEmpty ? selectedGender : currentOccupantGender;
    setFeedback({
      type: "success",
      message: "Payment successful! Reserving spot...",
    });

    startTransition(async () => {
      const result = await bookSpotAction(
        listing.id,
        genderToSubmit as "Male" | "Female",
        reference.reference,
        serviceFee,
      );

      if (result.error) {
        setFeedback({ type: "error", message: result.error });
      } else {
        router.push("/my-bookings");
      }
    });
  };

  const handlePaystackClose = () => {
    setFeedback({ type: "error", message: "Payment was cancelled." });
  };

  // When they click the first button
  const handleInitialClick = () => {
    if (isEmpty && !selectedGender) {
      alert("Please select a gender first!");
      return;
    }
    setIsModalOpen(true); // Show our custom modal
  };

  if (isFull) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
        <h3 className="text-xl font-bold text-red-400">Fully Booked</h3>
        <p className="text-sm text-gray-400 mt-2">There are no spots left.</p>
      </div>
    );
  }

  return (
    <>
      {/* --- MAIN WIDGET --- */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-1">
          ₦{listing.price?.toLocaleString()}{" "}
          <span className="text-sm text-gray-400">/ year</span>
        </h3>

        <div className="my-4 flex items-center gap-2 text-sm text-[#bcdff0]">
          <Users size={16} />
          <span>
            {capacity - filled} of {capacity} spots available
          </span>
        </div>

        <hr className="border-white/10 my-4" />

        {isEmpty ? (
          <div className="mb-4">
            <p className="text-sm text-gray-300 mb-2">
              You are the first. Set room gender:
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedGender("Male")}
                className={`flex-1 py-2 rounded-lg border ${selectedGender === "Male" ? "bg-blue-600 border-blue-600 text-white" : "border-white/20 text-gray-400"}`}
              >
                Male
              </button>
              <button
                onClick={() => setSelectedGender("Female")}
                className={`flex-1 py-2 rounded-lg border ${selectedGender === "Female" ? "bg-pink-600 border-pink-600 text-white" : "border-white/20 text-gray-400"}`}
              >
                Female
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-sm text-blue-200">
              Current roommates are <strong>{currentOccupantGender}</strong>.
            </p>
          </div>
        )}

        <div className="bg-[#00d4ff]/10 p-4 rounded-lg mb-4 border border-[#00d4ff]/30">
          <div className="flex items-center justify-between text-[#00d4ff] font-bold mb-1">
            <div className="flex items-center gap-2">
              <Lock size={16} />
              <span>Connection Fee</span>
            </div>
            <span>₦{serviceFee.toLocaleString()}</span>
          </div>
          <p className="text-xs text-gray-400">
            Pay a small fee to reserve this spot securely and unlock the
            Landlord's WhatsApp number.
          </p>
        </div>

        {feedback && (
          <p
            className={`mb-4 text-center text-sm ${feedback.type === "error" ? "text-red-400" : "text-green-400"}`}
          >
            {feedback.message}
          </p>
        )}

        {!userEmail ? (
          <button
            onClick={() => router.push("/auth?mode=signin")}
            className="w-full rounded-lg bg-gray-700 py-3 font-bold text-white"
          >
            Sign In to Book
          </button>
        ) : isEmpty && !selectedGender ? (
          <button
            disabled
            className="w-full rounded-lg bg-gray-700 py-3 font-bold text-gray-400 cursor-not-allowed"
          >
            Select Gender to Continue
          </button>
        ) : (
          <button
            onClick={handleInitialClick}
            disabled={isPending}
            className="w-full rounded-lg bg-gradient-to-r from-[#00d4ff] to-[#8A6CFF] py-3 font-bold text-[#041322] hover:opacity-90 transition-all"
          >
            {isPending
              ? "Processing..."
              : `Pay ₦${serviceFee.toLocaleString()} to Unlock`}
          </button>
        )}
      </div>

      {/* --- CONFIRMATION MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-[#041322] border border-white/20 p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-white/5 rounded-full"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold text-white mb-2">Connect Now</h2>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              Connect with the seller for: <br />
              <span className="font-bold text-[#00d4ff]">{listing.title}</span>
            </p>

            <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10 space-y-3">
              <div className="flex justify-between text-gray-300 text-sm">
                <span>Listing Price</span>
                <span className="font-bold text-white">
                  ₦{listing.price?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-[#00d4ff] font-bold text-sm">
                <span>Connection Fee</span>
                <span>₦{serviceFee.toLocaleString()}</span>
              </div>
            </div>

            <div className="mb-8">
              <h4 className="font-bold text-white mb-2">What happens next?</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-[#00d4ff]">•</span>
                  You'll pay a one-time connection fee of ₦
                  {serviceFee.toLocaleString()}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00d4ff]">•</span>
                  Once payment is confirmed, contact details are exchanged
                  instantly
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00d4ff]">•</span>
                  You can then arrange viewing and finalize accommodation
                  directly with the seller
                </li>
              </ul>
              <p className="text-xs text-yellow-400/80 mt-4 bg-yellow-400/10 p-2 rounded">
                Your contact information will only be exchanged after the
                payment of the connection fee.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 rounded-xl border border-white/20 text-white font-bold hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(false); // Close modal
                  initializePayment({
                    onSuccess: handlePaystackSuccess,
                    onClose: handlePaystackClose,
                  }); // Open Paystack
                }}
                className="flex-1 py-3 rounded-xl bg-[#00d4ff] text-[#041322] font-bold hover:opacity-90 transition-colors shadow-lg shadow-[#00d4ff]/20"
              >
                Continue to Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

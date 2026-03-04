"use client";

import { useTransition } from "react";
import { cancelBookingAction } from "@/app/actions/booking";

export function CancelBookingButton({ bookingId }: { bookingId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleCancel = () => {
    if (
      confirm(
        "Are you sure you want to cancel this booking? This will free up the spot.",
      )
    ) {
      startTransition(async () => {
        const res = await cancelBookingAction(bookingId);
        if (res.error) alert(res.error);
      });
    }
  };

  return (
    <button
      onClick={handleCancel}
      disabled={isPending}
      className="text-xs font-bold text-red-500 hover:text-red-400 underline disabled:opacity-50"
    >
      {isPending ? "Cancelling..." : "Cancel Booking"}
    </button>
  );
}

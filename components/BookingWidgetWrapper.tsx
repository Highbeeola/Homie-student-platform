"use client";

import dynamic from "next/dynamic";
import type { Listing } from "@/types/listing";

// This is where we safely load the Paystack logic in the browser
const BookingWidget = dynamic(
  () => import("@/components/BookingWidget").then((mod) => mod.BookingWidget),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 w-full rounded-2xl bg-white/5 border border-white/10 animate-pulse flex items-center justify-center text-gray-500">
        Loading payment securely...
      </div>
    ),
  }
);

export function BookingWidgetWrapper({ listing, userEmail }: { listing: Listing; userEmail?: string }) {
  return <BookingWidget listing={listing} userEmail={userEmail} />;
}
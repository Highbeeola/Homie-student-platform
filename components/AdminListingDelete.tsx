"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { adminDeleteListing } from "@/app/actions/admin"; // We created this action earlier

export function AdminListingDelete({
  listingId,
}: {
  listingId: string | number;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    // 1. Confirm before deleting
    const confirmed = window.confirm(
      "⚠️ ADMIN ACTION: Are you sure you want to delete this listing? This cannot be undone.",
    );

    if (!confirmed) return;

    // 2. Call Server Action
    startTransition(async () => {
      const res = await adminDeleteListing(listingId);
      if (res.error) {
        alert(res.error);
      } else {
        router.refresh(); // Refresh the list immediately
      }
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="rounded bg-red-500/10 px-3 py-1 text-xs font-bold text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
    >
      {isPending ? "Deleting..." : "Delete Listing"}
    </button>
  );
}

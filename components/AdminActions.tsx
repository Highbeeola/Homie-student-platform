"use client";

import { approveUser, rejectUser } from "@/app/actions/admin"; // Import from the new secure file
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export function AdminActions({ userId }: { userId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleApprove = () => {
    startTransition(async () => {
      const res = await approveUser(userId);
      if (res.error) alert(res.error);
      else router.refresh();
    });
  };

  const handleReject = () => {
    if (
      confirm(
        "Are you sure you want to reject this user? This will delete their ID card image.",
      )
    ) {
      startTransition(async () => {
        const res = await rejectUser(userId);
        if (res.error) alert(res.error);
        else router.refresh();
      });
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleApprove}
        disabled={isPending}
        className="rounded-md bg-green-500/20 border border-green-500/50 px-3 py-1 text-xs font-bold text-green-400 hover:bg-green-500 hover:text-black transition-colors disabled:opacity-50"
      >
        {isPending ? "..." : "Approve"}
      </button>
      <button
        onClick={handleReject}
        disabled={isPending}
        className="rounded-md bg-red-500/20 border border-red-500/50 px-3 py-1 text-xs font-bold text-red-400 hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
      >
        {isPending ? "..." : "Reject"}
      </button>
    </div>
  );
}

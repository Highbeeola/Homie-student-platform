"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { approveUser, rejectUser, revokeUser } from "@/app/actions/admin";

type AdminActionsProps = {
  userId: string;
  currentStatus: string;
};

export function AdminActions({ userId, currentStatus }: AdminActionsProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Helper to wrap actions with error handling
  const perform = (
    action: (id: string) => Promise<any>,
    confirmMsg?: string,
  ) => {
    if (confirmMsg && !confirm(confirmMsg)) return;

    startTransition(async () => {
      const res = await action(userId);
      if (res.error) alert(res.error);
      else router.refresh();
    });
  };

  if (currentStatus === "verified") {
    return (
      <button
        onClick={() =>
          perform(
            revokeUser,
            "Are you sure you want to REVOKE verification? Listings will lose the badge.",
          )
        }
        disabled={isPending}
        className="rounded-lg bg-yellow-500/20 px-4 py-2 text-xs font-bold text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500 hover:text-black transition-colors"
      >
        {isPending ? "..." : "Revoke Badge"}
      </button>
    );
  }

  return (
    <div className="flex gap-2">
      {/* Approve Button */}
      <button
        onClick={() => perform(approveUser)}
        disabled={isPending}
        className="rounded-lg bg-green-500/20 px-4 py-2 text-xs font-bold text-green-400 border border-green-500/30 hover:bg-green-500 hover:text-black transition-colors"
      >
        {isPending ? "..." : "Approve"}
      </button>

      {/* Reject Button (Only show if not already rejected) */}
      {currentStatus !== "rejected" && (
        <button
          onClick={() =>
            perform(
              rejectUser,
              "Rejecting will delete the user's ID card image. Continue?",
            )
          }
          disabled={isPending}
          className="rounded-lg bg-red-500/10 px-4 py-2 text-xs font-bold text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-white transition-colors"
        >
          {isPending ? "..." : "Reject"}
        </button>
      )}
    </div>
  );
}

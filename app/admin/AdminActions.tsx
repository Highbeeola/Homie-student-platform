// app/admin/AdminActions.tsx
"use client";

import { approveUser, rejectUser } from "./actions";
import { useTransition } from "react";

export function AdminActions({ userId }: { userId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleApprove = () => {
    startTransition(async () => {
      await approveUser(userId);
    });
  };

  const handleReject = () => {
    if (confirm("Are you sure you want to reject this verification?")) {
      startTransition(async () => {
        await rejectUser(userId);
      });
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleApprove}
        disabled={isPending}
        className="rounded-md bg-green-600 px-3 py-1 text-sm font-semibold text-white disabled:opacity-50"
      >
        Approve
      </button>
      <button
        onClick={handleReject}
        disabled={isPending}
        className="rounded-md bg-red-600 px-3 py-1 text-sm font-semibold text-white disabled:opacity-50"
      >
        Reject
      </button>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

type Props = {
  requestId: string;
  initialCount: number;
  initialVoted: boolean;
};

export default function RequestVoteButton({ requestId, initialCount, initialVoted }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const [count, setCount] = useState(initialCount);
  const [voted, setVoted] = useState(initialVoted);
  const [busy, setBusy] = useState(false);

  if (!session) {
    return (
      <Link
        href="/login"
        className="flex shrink-0 flex-col items-center rounded-sm border border-brass/30 px-3 py-1.5 text-parchment-light/70 hover:bg-brass/10"
        title="Log in to second this request"
      >
        <span className="font-display text-sm leading-none">{count}</span>
        <span className="mt-0.5 text-[10px] uppercase tracking-wide">
          {count === 1 ? "second" : "seconds"}
        </span>
      </Link>
    );
  }

  async function toggleVote() {
    if (busy) return;
    setBusy(true);
    // Optimistic update, since this is just a lightweight preference signal.
    const nextVoted = !voted;
    setVoted(nextVoted);
    setCount((c) => c + (nextVoted ? 1 : -1));

    const res = await fetch(`/api/requests/${requestId}/vote`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setVoted(data.voted);
      setCount(data.count);
    } else {
      // Roll back on failure.
      setVoted(!nextVoted);
      setCount((c) => c + (nextVoted ? -1 : 1));
    }
    setBusy(false);
    router.refresh();
  }

  return (
    <button
      onClick={toggleVote}
      disabled={busy}
      className={`flex shrink-0 flex-col items-center rounded-sm border px-3 py-1.5 transition-colors disabled:opacity-60 ${
        voted
          ? "border-oxblood bg-oxblood text-parchment-light"
          : "border-brass/30 text-parchment-light hover:bg-brass/10"
      }`}
      title={voted ? "Withdraw your second" : "Second this request"}
    >
      <span className="font-display text-sm leading-none">{count}</span>
      <span className="mt-0.5 text-[10px] uppercase tracking-wide">
        {count === 1 ? "second" : "seconds"}
      </span>
    </button>
  );
}

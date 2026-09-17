"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Request = {
  id: string;
  title: string;
  author: string | null;
  reason: string | null;
  status: string;
  requestedBy: { name: string };
  createdAt: string;
  voteCount: number;
};

const STATUS_OPTIONS = ["PENDING", "APPROVED", "FULFILLED", "DECLINED"];

export default function BookRequestsManager({ requests }: { requests: Request[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function updateStatus(id: string, status: string) {
    setBusyId(id);
    await fetch(`/api/requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBusyId(null);
    router.refresh();
  }

  async function removeRequest(id: string, title: string) {
    if (!confirm(`Remove the request for "${title}"?`)) return;
    setBusyId(id);
    await fetch(`/api/requests/${id}`, { method: "DELETE" });
    setBusyId(null);
    router.refresh();
  }

  if (requests.length === 0) {
    return <p className="text-sm text-parchment-light/60">No requests yet.</p>;
  }

  return (
    <div className="card divide-y divide-brass/20">
      {requests.map((r) => (
        <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div>
            <div className="flex items-center gap-2">
              <p className="font-display text-parchment-light">
                {r.title}
                {r.author ? <span className="text-parchment-light/60"> — {r.author}</span> : null}
              </p>
              {r.voteCount > 0 && (
                <span className="whitespace-nowrap rounded-sm bg-brass/20 px-1.5 py-0.5 text-[11px] text-brass-light">
                  {r.voteCount} {r.voteCount === 1 ? "second" : "seconds"}
                </span>
              )}
            </div>
            {r.reason && <p className="mt-1 text-sm text-parchment-light/70">{r.reason}</p>}
            <p className="mt-1 text-xs text-parchment-light/50">
              Requested by {r.requestedBy.name}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={r.status}
              onChange={(e) => updateStatus(r.id, e.target.value)}
              disabled={busyId === r.id}
              className="input-field w-auto py-1.5 text-sm"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button
              onClick={() => removeRequest(r.id, r.title)}
              disabled={busyId === r.id}
              className="rounded-sm border border-ember px-3 py-1.5 text-sm text-ember hover:bg-ember/10 disabled:opacity-40"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";

type Member = {
  id: string;
  name: string;
  email: string;
  role: "MEMBER" | "ADMIN";
  createdAt: string;
  _count: { reviews: number; shelfEntries: number };
};

export default function MembersTable({ members }: { members: Member[] }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function toggleRole(id: string, currentRole: string) {
    setBusyId(id);
    await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: currentRole === "ADMIN" ? "MEMBER" : "ADMIN" }),
    });
    setBusyId(null);
    router.refresh();
  }

  async function removeMember(id: string, name: string) {
    if (!confirm(`Remove ${name} from the club? This deletes their reviews and shelf.`)) return;
    setBusyId(id);
    await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    setBusyId(null);
    router.refresh();
  }

  return (
    <div className="card divide-y divide-brass/20">
      {members.map((m) => (
        <div key={m.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div>
            <p className="font-display text-parchment-light">
              {m.name}{" "}
              {m.role === "ADMIN" && (
                <span className="ml-1 rounded-sm bg-brass/20 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-brass-dark">
                  Admin
                </span>
              )}
            </p>
            <p className="text-sm text-parchment-light/60">{m.email}</p>
            <p className="text-xs text-parchment-light/50">
              {m._count.reviews} reviews &middot; {m._count.shelfEntries} books shelved
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => toggleRole(m.id, m.role)}
              disabled={busyId === m.id}
              className="btn-secondary px-3 py-1.5 text-sm disabled:opacity-60"
            >
              {m.role === "ADMIN" ? "Make member" : "Make admin"}
            </button>
            <button
              onClick={() => removeMember(m.id, m.name)}
              disabled={busyId === m.id || m.id === session?.user.id}
              title={m.id === session?.user.id ? "You can't remove yourself" : undefined}
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

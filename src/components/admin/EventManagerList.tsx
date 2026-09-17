"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Event = { id: string; title: string; date: string; location: string; recap: string | null };

export default function EventManagerList({ events }: { events: Event[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Remove "${title}"? This can't be undone.`)) return;
    setDeletingId(id);
    await fetch(`/api/events/${id}`, { method: "DELETE" });
    setDeletingId(null);
    router.refresh();
  }

  return (
    <div className="card divide-y divide-brass/20">
      {events.map((e) => (
        <div key={e.id} className="flex items-center justify-between gap-4 p-4">
          <div>
            <p className="font-display text-parchment-light">{e.title}</p>
            <p className="text-sm text-parchment-light/60">
              {new Date(e.date).toLocaleDateString()} &middot; {e.location}
              {e.recap && <span className="ml-2 text-forest-light">&middot; recap added</span>}
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Link href={`/admin/events/${e.id}/edit`} className="btn-secondary px-3 py-1.5 text-sm">
              {e.recap ? "Edit" : "Add recap"}
            </Link>
            <button
              onClick={() => handleDelete(e.id, e.title)}
              disabled={deletingId === e.id}
              className="rounded-sm border border-ember px-3 py-1.5 text-sm text-ember hover:bg-ember/10 disabled:opacity-60"
            >
              {deletingId === e.id ? "Removing…" : "Remove"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

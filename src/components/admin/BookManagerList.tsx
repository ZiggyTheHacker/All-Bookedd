"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Book = { id: string; title: string; author: string; genre: string };

export default function BookManagerList({ books }: { books: Book[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Remove "${title}" from the shelf? This also deletes its reviews.`)) return;
    setDeletingId(id);
    await fetch(`/api/books/${id}`, { method: "DELETE" });
    setDeletingId(null);
    router.refresh();
  }

  return (
    <div className="card divide-y divide-brass/20">
      {books.map((b) => (
        <div key={b.id} className="flex items-center justify-between gap-4 p-4">
          <div>
            <p className="font-display text-parchment-light">{b.title}</p>
            <p className="text-sm text-parchment-light/60">{b.author} &middot; {b.genre}</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Link href={`/admin/books/${b.id}/edit`} className="btn-secondary px-3 py-1.5 text-sm">
              Edit
            </Link>
            <button
              onClick={() => handleDelete(b.id, b.title)}
              disabled={deletingId === b.id}
              className="rounded-sm border border-ember px-3 py-1.5 text-sm text-ember hover:bg-ember/10 disabled:opacity-60"
            >
              {deletingId === b.id ? "Removing…" : "Remove"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Quote = { id: string; text: string; author: string; book: string | null };

export default function QuoteManager({ quotes }: { quotes: Quote[] }) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const [book, setBook] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const res = await fetch("/api/admin/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, author, book }),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong.");
      return;
    }
    setText("");
    setAuthor("");
    setBook("");
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this quote from the rotation?")) return;
    setDeletingId(id);
    await fetch(`/api/admin/quotes/${id}`, { method: "DELETE" });
    setDeletingId(null);
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="card space-y-3 p-6">
        <div>
          <label className="mb-1 block text-sm text-parchment-light/70">Quote</label>
          <textarea
            required
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Keep it to a single memorable line."
            className="input-field"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm text-parchment-light/70">Author</label>
            <input required value={author} onChange={(e) => setAuthor(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-parchment-light/70">Book (optional)</label>
            <input value={book} onChange={(e) => setBook(e.target.value)} className="input-field" />
          </div>
        </div>
        {error && <p className="text-sm text-ember">{error}</p>}
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
          {saving ? "Adding…" : "Add quote"}
        </button>
      </form>

      <div className="card divide-y divide-brass/20">
        {quotes.map((q) => (
          <div key={q.id} className="flex items-start justify-between gap-4 p-4">
            <div>
              <p className="text-sm italic text-parchment-light/90">"{q.text}"</p>
              <p className="mt-1 text-xs text-parchment-light/60">
                — {q.author}
                {q.book ? `, ${q.book}` : ""}
              </p>
            </div>
            <button
              onClick={() => handleDelete(q.id)}
              disabled={deletingId === q.id}
              className="shrink-0 rounded-sm border border-ember px-3 py-1.5 text-xs text-ember hover:bg-ember/10 disabled:opacity-60"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Book = { id: string; title: string; author: string };

export default function BookOfDayForm({ books, currentBookId }: { books: Book[]; currentBookId?: string }) {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);

  const [bookId, setBookId] = useState(currentBookId ?? books[0]?.id ?? "");
  const [date, setDate] = useState(today);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    await fetch("/api/book-of-day", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookId, date, note }),
    });
    setSaving(false);
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4 p-6">
      <div>
        <label className="mb-1 block text-sm text-parchment-light/70">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input-field"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-parchment-light/70">Book</label>
        <select value={bookId} onChange={(e) => setBookId(e.target.value)} className="input-field">
          {books.map((b) => (
            <option key={b.id} value={b.id}>
              {b.title} — {b.author}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm text-parchment-light/70">Why this pick? (optional)</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="A short note shown on the homepage"
          className="input-field"
        />
      </div>
      {saved && <p className="text-sm text-forest-light">Saved.</p>}
      <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
        {saving ? "Saving…" : "Set as Book of the Day"}
      </button>
    </form>
  );
}

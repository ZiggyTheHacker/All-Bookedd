"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BookRequestForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const res = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, author, reason }),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong.");
      return;
    }
    setTitle("");
    setAuthor("");
    setReason("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4 p-6">
      <div>
        <label className="mb-1 block text-sm text-parchment-light/70">Book title</label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-field"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-parchment-light/70">Author (optional)</label>
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="input-field"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-parchment-light/70">
          Why should the club read it? (optional)
        </label>
        <textarea
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="input-field"
        />
      </div>
      {error && <p className="text-sm text-ember">{error}</p>}
      <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
        {saving ? "Submitting…" : "Submit request"}
      </button>
    </form>
  );
}

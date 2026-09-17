"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type EventFormValues = {
  title: string;
  description: string;
  date: string;
  location: string;
  recap: string;
  recapImageUrl: string;
};

export default function EventForm({
  eventId,
  initial,
}: {
  eventId?: string;
  initial?: EventFormValues;
}) {
  const router = useRouter();
  const [values, setValues] = useState<EventFormValues>(
    initial ?? {
      title: "",
      description: "",
      date: new Date().toISOString().slice(0, 10),
      location: "",
      recap: "",
      recapImageUrl: "",
    }
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update<K extends keyof EventFormValues>(key: K, value: EventFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch(eventId ? `/api/events/${eventId}` : "/api/events", {
      method: eventId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong.");
      return;
    }
    router.push("/admin/events");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4 p-6">
      <div>
        <label className="mb-1 block text-sm text-parchment-light/70">Title</label>
        <input
          value={values.title}
          onChange={(e) => update("title", e.target.value)}
          className="input-field"
          required
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-parchment-light/70">Date</label>
          <input
            type="date"
            value={values.date}
            onChange={(e) => update("date", e.target.value)}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-parchment-light/70">Location</label>
          <input
            value={values.location}
            onChange={(e) => update("location", e.target.value)}
            className="input-field"
            required
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm text-parchment-light/70">Description</label>
        <textarea
          value={values.description}
          onChange={(e) => update("description", e.target.value)}
          rows={3}
          className="input-field"
          required
        />
      </div>

      {eventId && (
        <div className="border-t border-brass/20 pt-4">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-parchment-light/70">
            Recap {"(after the meetup)"}
          </p>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-parchment-light/70">Recap notes</label>
              <textarea
                value={values.recap}
                onChange={(e) => update("recap", e.target.value)}
                rows={3}
                placeholder="How did it go? What did the club think?"
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-parchment-light/70">Recap photo URL</label>
              <input
                value={values.recapImageUrl}
                onChange={(e) => update("recapImageUrl", e.target.value)}
                placeholder="https://…"
                className="input-field"
              />
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-ember">{error}</p>}
      <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
        {loading ? "Saving…" : eventId ? "Save changes" : "Add event"}
      </button>
    </form>
  );
}

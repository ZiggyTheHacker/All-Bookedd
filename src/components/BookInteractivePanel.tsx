"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { StarRatingInput } from "./StarRating";

type Props = {
  bookId: string;
  initialRating: number;
  initialContent: string;
  initialShelfStatus: string | null;
};

const SHELF_LABELS: Record<string, string> = {
  WANT_TO_READ: "Want to read",
  READING: "Currently reading",
  READ: "Read",
};

export default function BookInteractivePanel({
  bookId,
  initialRating,
  initialContent,
  initialShelfStatus,
}: Props) {
  const { data: session } = useSession();
  const router = useRouter();

  const [rating, setRating] = useState(initialRating);
  const [content, setContent] = useState(initialContent);
  const [shelfStatus, setShelfStatus] = useState(initialShelfStatus);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  if (!session) {
    return (
      <div className="card p-5 text-sm text-parchment-light/80">
        <Link href="/login" className="font-semibold text-ember hover:underline">
          Log in
        </Link>{" "}
        to add this book to your shelf or leave a review.
      </div>
    );
  }

  async function handleShelfChange(status: string) {
    setShelfStatus(status);
    await fetch("/api/shelf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookId, status }),
    });
    router.refresh();
  }

  async function handleReviewSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (rating === 0) {
      setError("Pick a star rating first.");
      return;
    }
    setSubmitting(true);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookId, rating, content }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong.");
      return;
    }
    setSaved(true);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="card p-5">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-parchment-light/70">
          My shelf
        </p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(SHELF_LABELS).map(([value, label]) => (
            <button
              key={value}
              onClick={() => handleShelfChange(value)}
              className={`rounded-sm border px-3 py-1.5 text-sm ${
                shelfStatus === value
                  ? "border-oxblood bg-oxblood text-parchment-light"
                  : "border-brass/30 text-parchment-light hover:bg-brass/10"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-5">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-parchment-light/70">
          {initialContent ? "Update your review" : "Leave a review"}
        </p>
        <form onSubmit={handleReviewSubmit} className="space-y-3">
          <StarRatingInput value={rating} onChange={setRating} />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What did you think?"
            rows={4}
            className="input-field"
            required
          />
          {error && <p className="text-sm text-ember">{error}</p>}
          {saved && <p className="text-sm text-forest-light">Saved — thank you!</p>}
          <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
            {submitting ? "Saving…" : "Save review"}
          </button>
        </form>
      </div>
    </div>
  );
}

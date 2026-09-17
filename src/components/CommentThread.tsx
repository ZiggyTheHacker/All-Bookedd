"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { AvatarBadge } from "./avatars";

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  user: { name: string; avatar: string };
};

type Props = {
  bookId: string;
  initialComments: Comment[];
};

export default function CommentThread({ bookId, initialComments }: Props) {
  const { data: session } = useSession();
  const router = useRouter();

  const [comments, setComments] = useState(initialComments);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setError("");
    setSubmitting(true);

    const res = await fetch(`/api/books/${bookId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong.");
      return;
    }

    const comment = await res.json();
    setComments((prev) => [comment, ...prev]);
    setContent("");
    router.refresh();
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    const res = await fetch(`/api/comments/${id}`, { method: "DELETE" });
    if (res.ok) {
      setComments((prev) => prev.filter((c) => c.id !== id));
    }
    setDeletingId(null);
    router.refresh();
  }

  return (
    <div>
      <h2 className="text-2xl">Discussion</h2>

      {session ? (
        <form onSubmit={handleSubmit} className="card mt-4 space-y-3 p-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share a thought between meetings…"
            rows={3}
            className="input-field"
            required
          />
          {error && <p className="text-sm text-ember">{error}</p>}
          <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
            {submitting ? "Posting…" : "Post"}
          </button>
        </form>
      ) : (
        <div className="card mt-4 p-4 text-sm text-parchment-light/80">
          <Link href="/login" className="font-semibold text-ember hover:underline">
            Log in
          </Link>{" "}
          to join the discussion.
        </div>
      )}

      {comments.length === 0 ? (
        <p className="mt-6 text-parchment-light/60">No comments yet — start the conversation.</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {comments.map((c) => (
            <li key={c.id} className="card p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AvatarBadge id={c.user.avatar} size={28} />
                  <p className="font-display text-parchment-light">{c.user.name}</p>
                  <span className="text-xs text-parchment-light/50">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {session && (session.user.id === c.userId || session.user.role === "ADMIN") && (
                  <button
                    onClick={() => handleDelete(c.id)}
                    disabled={deletingId === c.id}
                    className="text-xs text-parchment-light/50 hover:text-oxblood disabled:opacity-60"
                  >
                    {deletingId === c.id ? "Removing…" : "Delete"}
                  </button>
                )}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-parchment-light/90">{c.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

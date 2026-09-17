import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import BookCard from "@/components/BookCard";
import { AvatarBadge } from "@/components/avatars";
import ProfileAvatarEditor from "@/components/ProfileAvatarEditor";

import { getBookBuddies } from "@/lib/bookBuddy";

const STATUS_LABELS: Record<string, string> = {
  WANT_TO_READ: "Want to read",
  READING: "Currently reading",
  READ: "Read",
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) return null; // middleware redirects, this is a fallback

  const [shelfEntries, reviews] = await Promise.all([
    prisma.shelfEntry.findMany({
      where: { userId: session.user.id },
      include: { book: { include: { reviews: { select: { rating: true } } } } },
      orderBy: { addedAt: "desc" },
    }),
    prisma.review.findMany({
      where: { userId: session.user.id },
      include: { book: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const grouped = {
    READING: shelfEntries.filter((e) => e.status === "READING"),
    WANT_TO_READ: shelfEntries.filter((e) => e.status === "WANT_TO_READ"),
    READ: shelfEntries.filter((e) => e.status === "READ"),
  };

  const now = new Date();
  const finishedThisMonth = shelfEntries.filter(
    (e) =>
      e.status === "READ" &&
      e.statusUpdatedAt.getFullYear() === now.getFullYear() &&
      e.statusUpdatedAt.getMonth() === now.getMonth()
  ).length;

  const myGenres = new Set(shelfEntries.map((e) => e.book.genre));
  const buddies = await getBookBuddies(session.user.id, myGenres);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-xs uppercase tracking-[0.2em] text-forest-light">My account</p>
      <div className="mt-1 flex items-center gap-4">
        <AvatarBadge id={session.user.avatar} size={64} />
        <div>
          <h1 className="text-3xl">{session.user.name}'s Shelf</h1>
          <ProfileAvatarEditor initialAvatar={session.user.avatar} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {grouped.READING.length > 0 && (
          <span className="rounded-sm border border-brass/30 bg-brass/10 px-3 py-1 text-xs uppercase tracking-wide text-brass-light">
            Currently reading {grouped.READING.length} book{grouped.READING.length === 1 ? "" : "s"}
          </span>
        )}
        {finishedThisMonth > 0 && (
          <span className="rounded-sm border border-forest-light/40 bg-forest-light/10 px-3 py-1 text-xs uppercase tracking-wide text-forest-light">
            Finished {finishedThisMonth} book{finishedThisMonth === 1 ? "" : "s"} this month
          </span>
        )}
      </div>

      <Link href="/account" className="mt-4 inline-block text-sm text-ember hover:underline">
        Account settings →
      </Link>

      {(["READING", "WANT_TO_READ", "READ"] as const).map((status) => (
        <section key={status} className="mt-10">
          <h2 className="text-xl text-parchment-light">{STATUS_LABELS[status]}</h2>
          {grouped[status].length === 0 ? (
            <p className="mt-2 text-sm text-parchment-light/60">Nothing here yet.</p>
          ) : (
            <div className="mt-4 flex flex-wrap gap-8">
              {grouped[status].map((entry) => {
                const avg =
                  entry.book.reviews.length > 0
                    ? entry.book.reviews.reduce((s, r) => s + r.rating, 0) /
                      entry.book.reviews.length
                    : null;
                return (
                  <BookCard
                    key={entry.id}
                    id={entry.book.id}
                    title={entry.book.title}
                    author={entry.book.author}
                    coverUrl={entry.book.coverUrl}
                    genre={entry.book.genre}
                    avgRating={avg}
                  />
                );
              })}
            </div>
          )}
        </section>
      ))}

      {buddies.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl text-parchment-light">Book buddies</h2>
          <p className="mt-1 text-sm text-parchment-light/60">
            Members whose shelves overlap with yours in genre.
          </p>
          <div className="mt-4 flex flex-wrap gap-4">
            {buddies.map((b) => (
              <div key={b.id} className="card flex items-center gap-3 p-4">
                <AvatarBadge id={b.avatar} size={40} />
                <div>
                  <p className="font-display text-parchment-light">{b.name}</p>
                  <p className="text-xs text-parchment-light/60">
                    Shares {b.sharedGenres.length} genre{b.sharedGenres.length === 1 ? "" : "s"}:{" "}
                    {b.sharedGenres.join(", ")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-12">
        <h2 className="text-xl text-parchment-light">My reviews</h2>
        {reviews.length === 0 ? (
          <p className="mt-2 text-sm text-parchment-light/60">You haven't reviewed anything yet.</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {reviews.map((r) => (
              <li key={r.id} className="card p-4">
                <Link href={`/books/${r.book.id}`} className="font-display text-parchment-light hover:text-ember">
                  {r.book.title}
                </Link>
                <p className="mt-1 text-sm text-brass">{"★".repeat(r.rating)}</p>
                <p className="mt-1 text-sm text-parchment-light/90">{r.content}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import BookRequestForm from "@/components/BookRequestForm";
import { AvatarBadge } from "@/components/avatars";
import RequestVoteButton from "@/components/RequestVoteButton";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  APPROVED: "Approved — coming soon",
  FULFILLED: "Added to the shelf",
  DECLINED: "Not this time",
};

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-brass/20 text-brass-dark",
  APPROVED: "bg-forest/20 text-forest-light",
  FULFILLED: "bg-forest/30 text-forest-light",
  DECLINED: "bg-parchment-light/10 text-parchment-light/50",
};

// PENDING petitions surface first (sorted by how many seconds they've got),
// so members can see at a glance what the club is most excited to read next.
// Everything else trails behind in recency order.
const STATUS_ORDER: Record<string, number> = {
  PENDING: 0,
  APPROVED: 1,
  FULFILLED: 2,
  DECLINED: 3,
};

export default async function RequestsPage() {
  const session = await getServerSession(authOptions);
  const rawRequests = await prisma.bookRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      requestedBy: { select: { name: true, avatar: true } },
      votes: { select: { userId: true } },
    },
  });

  const requests = rawRequests
    .map((r) => ({
      ...r,
      voteCount: r.votes.length,
      votedByMe: session ? r.votes.some((v) => v.userId === session.user.id) : false,
    }))
    .sort((a, b) => {
      const statusDiff = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
      if (statusDiff !== 0) return statusDiff;
      if (a.status === "PENDING" && b.voteCount !== a.voteCount) {
        return b.voteCount - a.voteCount;
      }
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <p className="text-xs uppercase tracking-[0.2em] text-forest-light">Have a suggestion?</p>
      <h1 className="mt-1 text-3xl">Request a Book</h1>
      <p className="mt-2 max-w-xl text-parchment-light/70">
        See something missing from the shelf? Petition for it here — admins review requests
        and add books to the catalog.
      </p>

      <div className="mt-8">
        {session ? (
          <BookRequestForm />
        ) : (
          <div className="card p-6 text-sm text-parchment-light/80">
            <Link href="/login" className="font-semibold text-ember hover:underline">
              Log in
            </Link>{" "}
            to submit a request.
          </div>
        )}
      </div>

      <section className="mt-12">
        <h2 className="text-xl text-parchment-light">All requests</h2>
        {requests.length === 0 ? (
          <p className="mt-3 text-sm text-parchment-light/60">
            No requests yet — be the first to petition for a book.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {requests.map((r) => (
              <div key={r.id} className="card flex items-start justify-between gap-4 p-4">
                <div className="flex items-start gap-3">
                  <AvatarBadge id={r.requestedBy.avatar} size={32} />
                  <div>
                    <p className="font-display text-parchment-light">
                      {r.title}
                      {r.author ? <span className="text-parchment-light/60"> — {r.author}</span> : null}
                    </p>
                    {r.reason && (
                      <p className="mt-1 text-sm text-parchment-light/70">{r.reason}</p>
                    )}
                    <p className="mt-1 text-xs text-parchment-light/50">
                      Requested by {r.requestedBy.name}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  {r.status === "PENDING" && (
                    <RequestVoteButton
                      requestId={r.id}
                      initialCount={r.voteCount}
                      initialVoted={r.votedByMe}
                    />
                  )}
                  <span
                    className={`whitespace-nowrap rounded-sm px-2 py-1 text-xs ${STATUS_STYLES[r.status]}`}
                  >
                    {STATUS_LABELS[r.status]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

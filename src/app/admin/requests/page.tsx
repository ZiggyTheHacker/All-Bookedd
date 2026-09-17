import { prisma } from "@/lib/prisma";
import BookRequestsManager from "@/components/admin/BookRequestsManager";

export default async function AdminRequestsPage() {
  const requests = await prisma.bookRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: { requestedBy: { select: { name: true } }, votes: true },
  });

  const withVoteCount = requests
    .map((r) => ({ ...r, voteCount: r.votes.length }))
    .sort((a, b) => b.voteCount - a.voteCount);

  return (
    <div>
      <h2 className="mb-6 text-xl">Book Requests</h2>
      <p className="mb-4 text-sm text-parchment-light/60">
        Members can petition for books to be added, and second each other's petitions.
        Mark a request "Fulfilled" once you've added the book via Manage Books, or
        "Declined" if it's not a fit. Sorted by most-seconded first.
      </p>
      <BookRequestsManager
        requests={withVoteCount.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }))}
      />
    </div>
  );
}

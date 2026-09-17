import { prisma } from "@/lib/prisma";

export default async function AdminOverviewPage() {
  const [bookCount, userCount, reviewCount, upcomingEvents, pendingRequests] = await Promise.all([
    prisma.book.count(),
    prisma.user.count(),
    prisma.review.count(),
    prisma.event.count({ where: { date: { gte: new Date() } } }),
    prisma.bookRequest.count({ where: { status: "PENDING" } }),
  ]);

  const stats = [
    { label: "Books on the shelf", value: bookCount },
    { label: "Members", value: userCount },
    { label: "Reviews written", value: reviewCount },
    { label: "Upcoming events", value: upcomingEvents },
    { label: "Pending book requests", value: pendingRequests },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {stats.map((s) => (
        <div key={s.label} className="card p-6">
          <p className="text-3xl font-display text-ember">{s.value}</p>
          <p className="mt-1 text-sm text-parchment-light/70">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

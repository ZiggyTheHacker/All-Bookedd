import { prisma } from "@/lib/prisma";
import BookOfDayForm from "@/components/admin/BookOfDayForm";

export default async function AdminBookOfDayPage() {
  const [books, upcoming] = await Promise.all([
    prisma.book.findMany({ orderBy: { title: "asc" }, select: { id: true, title: true, author: true } }),
    prisma.featuredBook.findMany({
      orderBy: { date: "desc" },
      take: 10,
      include: { book: { select: { title: true } } },
    }),
  ]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentBookId = upcoming.find((f) => f.date <= today)?.bookId;

  return (
    <div>
      <h2 className="mb-6 text-xl">Book of the Day</h2>
      <BookOfDayForm books={books} currentBookId={currentBookId} />

      <h3 className="mb-3 mt-10 text-lg text-parchment-light">Recent & scheduled picks</h3>
      {upcoming.length === 0 ? (
        <p className="text-parchment-light/60">No picks scheduled yet.</p>
      ) : (
        <ul className="card divide-y divide-brass/20">
          {upcoming.map((f) => (
            <li key={f.id} className="flex justify-between p-3 text-sm">
              <span>{f.book.title}</span>
              <span className="text-parchment-light/60">{f.date.toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

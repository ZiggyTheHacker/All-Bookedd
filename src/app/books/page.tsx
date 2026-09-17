import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import BookCard from "@/components/BookCard";
import SortFilterBar from "@/components/SortFilterBar";

async function getBooks(searchParams: { [key: string]: string | undefined }) {
  const { genre, q, sort } = searchParams;

  const where: Prisma.BookWhereInput = {};
  if (genre) where.genre = genre;
  if (q) {
    where.OR = [{ title: { contains: q } }, { author: { contains: q } }];
  }

  const orderBy: Prisma.BookOrderByWithRelationInput =
    sort === "newest"
      ? { createdAt: "desc" }
      : sort === "author"
      ? { author: "asc" }
      : sort === "year"
      ? { publishedYear: "desc" }
      : { title: "asc" };

  const books = await prisma.book.findMany({
    where,
    orderBy,
    include: { reviews: { select: { rating: true } } },
  });

  return books.map((b) => ({
    ...b,
    avgRating:
      b.reviews.length > 0
        ? b.reviews.reduce((s, r) => s + r.rating, 0) / b.reviews.length
        : null,
  }));
}

export default async function BooksPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const books = await getBooks(searchParams);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-xs uppercase tracking-[0.2em] text-forest-light">The full catalog</p>
      <h1 className="mt-1 text-3xl">Browse the Shelves</h1>
      <p className="mt-2 max-w-xl text-parchment-light/70">
        Every book the club has ever shelved, sortable like a proper card catalog.
      </p>

      <div className="mt-6">
        <SortFilterBar />
      </div>

      {books.length === 0 ? (
        <p className="mt-12 text-parchment-light/60">
          No books match that search. Try a different title, author, or genre.
        </p>
      ) : (
        <div className="mt-10 flex flex-wrap gap-8">
          {books.map((b) => (
            <BookCard
              key={b.id}
              id={b.id}
              title={b.title}
              author={b.author}
              coverUrl={b.coverUrl}
              genre={b.genre}
              avgRating={b.avgRating}
            />
          ))}
        </div>
      )}
    </div>
  );
}

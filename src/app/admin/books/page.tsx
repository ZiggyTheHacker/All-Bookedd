import Link from "next/link";
import { prisma } from "@/lib/prisma";
import BookManagerList from "@/components/admin/BookManagerList";

export default async function AdminBooksPage() {
  const books = await prisma.book.findMany({
    orderBy: { title: "asc" },
    select: { id: true, title: true, author: true, genre: true },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl">Manage Books</h2>
        <Link href="/admin/books/new" className="btn-primary">
          Add a book
        </Link>
      </div>
      {books.length === 0 ? (
        <p className="text-parchment-light/60">No books yet — add the first one.</p>
      ) : (
        <BookManagerList books={books} />
      )}
    </div>
  );
}

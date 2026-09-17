import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BookForm from "@/components/admin/BookForm";

export default async function EditBookPage({ params }: { params: { id: string } }) {
  const book = await prisma.book.findUnique({ where: { id: params.id } });
  if (!book) notFound();

  return (
    <div>
      <h2 className="mb-6 text-xl">Edit "{book.title}"</h2>
      <BookForm
        bookId={book.id}
        initial={{
          title: book.title,
          author: book.author,
          coverUrl: book.coverUrl,
          genre: book.genre,
          description: book.description,
          publishedYear: book.publishedYear,
          pages: book.pages,
          fileUrl: book.fileUrl ?? "",
        }}
      />
    </div>
  );
}

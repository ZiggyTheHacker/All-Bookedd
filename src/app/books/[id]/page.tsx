import Image from "next/image";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StarRatingDisplay } from "@/components/StarRating";
import { AvatarBadge } from "@/components/avatars";
import BookInteractivePanel from "@/components/BookInteractivePanel";
import CommentThread from "@/components/CommentThread";
import { PageTurn } from "@/components/Motion";

export default async function BookDetailPage({ params }: { params: { id: string } }) {
  const [book, session] = await Promise.all([
    prisma.book.findUnique({
      where: { id: params.id },
      include: {
        reviews: {
          include: { user: { select: { name: true, avatar: true } } },
          orderBy: { createdAt: "desc" },
        },
        comments: {
          include: { user: { select: { name: true, avatar: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    }),
    getServerSession(authOptions),
  ]);

  if (!book) notFound();

  const avgRating =
    book.reviews.length > 0
      ? book.reviews.reduce((s, r) => s + r.rating, 0) / book.reviews.length
      : null;

  let myShelfStatus: string | null = null;
  let myReview = { rating: 0, content: "" };
  if (session) {
    const [shelfEntry, review] = await Promise.all([
      prisma.shelfEntry.findUnique({
        where: { bookId_userId: { bookId: book.id, userId: session.user.id } },
      }),
      prisma.review.findUnique({
        where: { bookId_userId: { bookId: book.id, userId: session.user.id } },
      }),
    ]);
    myShelfStatus = shelfEntry?.status ?? null;
    if (review) myReview = { rating: review.rating, content: review.content };
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <PageTurn pageKey={book.id}>
        <div className="grid gap-8 md:grid-cols-[220px_1fr]">
          <div className="relative mx-auto h-72 w-48 overflow-hidden rounded-sm shadow-spine">
            <Image src={book.coverUrl} alt={`Cover of ${book.title}`} fill sizes="192px" className="object-cover" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-forest-light">{book.genre}</p>
            <h1 className="mt-1 text-3xl">{book.title}</h1>
            <p className="mt-1 text-lg text-parchment-light/70">{book.author} &middot; {book.publishedYear}</p>
            <div className="mt-2"><StarRatingDisplay rating={avgRating} /></div>
            <p className="mt-4 max-w-2xl leading-relaxed text-parchment-light/90">{book.description}</p>
            <p className="mt-3 text-sm text-parchment-light/60">{book.pages} pages</p>

            {book.fileUrl && (
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={book.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Read online
                </a>
                <a href={book.fileUrl} download className="btn-secondary">
                  Download
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-[1fr_320px]">
          <div>
            <h2 className="text-2xl">Member reviews</h2>
            {book.reviews.length === 0 ? (
              <p className="mt-4 text-parchment-light/60">No reviews yet — be the first to weigh in.</p>
            ) : (
              <ul className="mt-6 space-y-5">
                {book.reviews.map((r) => (
                  <li key={r.id} className="card p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AvatarBadge id={r.user.avatar} size={28} />
                        <p className="font-display text-parchment-light">{r.user.name}</p>
                      </div>
                      <StarRatingDisplay rating={r.rating} />
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-parchment-light/90">{r.content}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <BookInteractivePanel
              bookId={book.id}
              initialRating={myReview.rating}
              initialContent={myReview.content}
              initialShelfStatus={myShelfStatus}
            />
          </div>
        </div>

        <div className="shelf-divider mt-12" />

        <div className="mt-12 max-w-3xl">
          <CommentThread
            bookId={book.id}
            initialComments={book.comments.map((c) => ({
              ...c,
              createdAt: c.createdAt.toISOString(),
            }))}
          />
        </div>
      </PageTurn>
    </div>
  );
}

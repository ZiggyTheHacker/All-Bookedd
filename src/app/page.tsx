import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getQuoteOfTheDay } from "@/lib/quoteOfTheDay";
import { StarRatingDisplay } from "@/components/StarRating";
import FeaturedShelf from "@/components/FeaturedShelf";
import ShelfSpotlight from "@/components/ShelfSpotlight";
import { FadeUp } from "@/components/Motion";
import { AvatarBadge } from "@/components/avatars";
import QuoteShareCard from "@/components/QuoteShareCard";

async function getBookOfTheDay() {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return prisma.featuredBook.findFirst({
    where: { date: { lte: today } },
    orderBy: { date: "desc" },
    include: { book: { include: { reviews: true } } },
  });
}

async function getFeaturedBooks(bookOfDayId?: string) {
  const books = await prisma.book.findMany({
    include: { reviews: { select: { rating: true } } },
  });

  const withRatings = books.map((b) => ({
    id: b.id,
    title: b.title,
    author: b.author,
    genre: b.genre,
    createdAt: b.createdAt,
    avgRating:
      b.reviews.length > 0
        ? b.reviews.reduce((s, r) => s + r.rating, 0) / b.reviews.length
        : -1,
  }));

  const ranked = withRatings
    .filter((b) => b.id !== bookOfDayId)
    .sort((a, b) => b.avgRating - a.avgRating || b.createdAt.getTime() - a.createdAt.getTime());

  const dayPick = withRatings.find((b) => b.id === bookOfDayId);
  const picks = [dayPick, ...ranked].filter(Boolean).slice(0, 6) as typeof withRatings;

  return picks.map(({ id, title, author, genre }) => ({ id, title, author, genre }));
}

const STATUS_VERBS: Record<string, string> = {
  WANT_TO_READ: "added to their to-read list",
  READING: "started reading",
  READ: "finished reading",
};

async function getActivityFeed() {
  const [shelfActivity, reviewActivity] = await Promise.all([
    prisma.shelfEntry.findMany({
      orderBy: { statusUpdatedAt: "desc" },
      take: 8,
      include: { user: { select: { name: true, avatar: true } }, book: { select: { id: true, title: true } } },
    }),
    prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { user: { select: { name: true, avatar: true } }, book: { select: { id: true, title: true } } },
    }),
  ]);

  const items = [
    ...shelfActivity.map((e) => ({
      key: `shelf-${e.id}`,
      at: e.statusUpdatedAt,
      userName: e.user.name,
      userAvatar: e.user.avatar,
      bookId: e.book.id,
      bookTitle: e.book.title,
      text: STATUS_VERBS[e.status] ?? "updated their shelf for",
    })),
    ...reviewActivity.map((r) => ({
      key: `review-${r.id}`,
      at: r.createdAt,
      userName: r.user.name,
      userAvatar: r.user.avatar,
      bookId: r.book.id,
      bookTitle: r.book.title,
      text: `rated ${"★".repeat(r.rating)} —`,
    })),
  ];

  return items.sort((a, b) => b.at.getTime() - a.at.getTime()).slice(0, 6);
}

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const [featured, quote, activity] = await Promise.all([
    getBookOfTheDay(),
    getQuoteOfTheDay(),
    getActivityFeed(),
  ]);
  const featuredBooks = await getFeaturedBooks(featured?.book.id);

  const featuredAvg =
    featured && featured.book.reviews.length > 0
      ? featured.book.reviews.reduce((s, r) => s + r.rating, 0) / featured.book.reviews.length
      : null;

  return (
    <div>
      {/* Hero: real bookstore photo with the pick pulled forward */}
      <section className="relative overflow-hidden bg-walnut-dark">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-bookstore.jpg"
            alt="A warmly lit bookstore interior, shelves stacked to the ceiling"
            fill
            priority
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-walnut-dark via-walnut-dark/80 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-28">
          <p className="font-display text-sm uppercase tracking-[0.25em] text-brass-light">
            Est. for readers who annotate in the margins
          </p>
          <h1 className="mt-3 max-w-xl font-display text-4xl italic text-parchment-light sm:text-5xl">
            Pull up a chair. There's always a book waiting for you here.
          </h1>
          <p className="mt-4 max-w-lg text-parchment-light/85">
            All Booked is a small, opinionated book club — one pick a day, honest reviews from
            real members, and a shelf you actually want to browse.
          </p>
          <div className="mt-7 flex gap-3">
            <Link href="/books" className="btn-primary">
              Browse the shelves
            </Link>
            {session ? (
              <Link
                href="/profile"
                className="btn-secondary border-brass-light text-parchment-light hover:bg-parchment-light/10"
              >
                Go to my shelf
              </Link>
            ) : (
              <Link
                href="/register"
                className="btn-secondary border-brass-light text-parchment-light hover:bg-parchment-light/10"
              >
                Join the club
              </Link>
            )}
          </div>
        </div>
        <div className="shelf-divider" />
      </section>

      {/* Book of the day */}
      {featured && (
        <section id="book-of-the-day" className="mx-auto max-w-6xl px-4 py-14">
          <FadeUp>
            <p className="text-xs uppercase tracking-[0.2em] text-forest-light">Today's pick</p>
            <h2 className="mt-1 text-3xl">Book of the Day</h2>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="card mt-6 flex flex-col gap-6 p-6 sm:flex-row">
              <div className="relative mx-auto h-64 w-44 shrink-0 rotate-[-2deg] overflow-hidden rounded-sm shadow-spine sm:mx-0">
                <Image
                  src={featured.book.coverUrl}
                  alt={`Cover of ${featured.book.title}`}
                  fill
                  sizes="176px"
                  className="object-cover"
                />
              </div>
              <div>
                <Link href={`/books/${featured.book.id}`}>
                  <h3 className="text-2xl hover:text-ember">{featured.book.title}</h3>
                </Link>
                <p className="text-parchment-light/70">
                  {featured.book.author} &middot; {featured.book.publishedYear}
                </p>
                <div className="mt-2">
                  <StarRatingDisplay rating={featuredAvg} />
                </div>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-parchment-light/90">
                  {featured.book.description}
                </p>
                {featured.note && (
                  <p className="mt-3 border-l-2 border-brass pl-3 text-sm italic text-parchment-light/80">
                    {featured.note}
                  </p>
                )}
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <Link href={`/books/${featured.book.id}`} className="btn-primary inline-flex">
                    Read & review
                  </Link>
                  <Link href="/archive" className="text-sm text-ember hover:underline">
                    See past picks →
                  </Link>
                </div>
              </div>
            </div>
          </FadeUp>
        </section>
      )}

      {/* Quote of the day */}
      {quote && (
        <section className="bg-walnut py-14">
          <FadeUp>
            <div className="mx-auto max-w-3xl px-4 text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-brass-light">
                Quote of the day
              </p>
              <p className="mt-4 font-display text-2xl italic leading-relaxed text-parchment-light sm:text-3xl">
                "{quote.text}"
              </p>
              <p className="mt-4 text-sm text-brass-light">
                — {quote.author}
                {quote.book ? `, ${quote.book}` : ""}
              </p>
              <QuoteShareCard text={quote.text} author={quote.author} book={quote.book} />
            </div>
          </FadeUp>
        </section>
      )}

      {/* Featured shelf: illustrated highlights with tags, in a dark lit scene */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <FadeUp>
          <p className="text-center text-xs uppercase tracking-[0.2em] text-forest-light">
            From the shelf
          </p>
          <h2 className="mt-1 text-center text-3xl">A Few Worth Pulling Down</h2>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="mt-10">
            <ShelfSpotlight>
              <FeaturedShelf featured={featuredBooks} />
            </ShelfSpotlight>
          </div>
        </FadeUp>

        <div className="mt-10 text-center">
          <Link href="/books" className="btn-secondary">
            Browse the Full Shelf
          </Link>
        </div>
      </section>

      {/* Activity feed: social proof that the club is active */}
      {activity.length > 0 && (
        <section className="bg-walnut-dark/40 py-16">
          <div className="mx-auto max-w-3xl px-4">
            <FadeUp>
              <p className="text-center text-xs uppercase tracking-[0.2em] text-forest-light">
                Around the club
              </p>
              <h2 className="mt-1 text-center text-3xl">Who's Reading What</h2>
            </FadeUp>

            <FadeUp delay={0.1}>
              <ul className="mt-8 space-y-3">
                {activity.map((item) => (
                  <li key={item.key} className="card flex items-center gap-3 p-3">
                    <AvatarBadge id={item.userAvatar} size={28} />
                    <p className="text-sm text-parchment-light/90">
                      <span className="font-display text-parchment-light">{item.userName}</span>{" "}
                      {item.text}{" "}
                      <Link href={`/books/${item.bookId}`} className="text-ember hover:underline">
                        {item.bookTitle}
                      </Link>
                    </p>
                  </li>
                ))}
              </ul>
            </FadeUp>
          </div>
        </section>
      )}
    </div>
  );
}

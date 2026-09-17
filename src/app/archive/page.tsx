import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StarRatingDisplay } from "@/components/StarRating";
import { FadeUp } from "@/components/Motion";

async function getPastPicks() {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return prisma.featuredBook.findMany({
    where: { date: { lte: today } },
    orderBy: { date: "desc" },
    include: { book: { include: { reviews: { select: { rating: true } } } } },
  });
}

function monthLabel(date: Date) {
  return date.toLocaleString("en-US", { month: "long", year: "numeric" });
}

export default async function ArchivePage() {
  const picks = await getPastPicks();

  // Group consecutive picks under a "Month Year" heading, timeline-style.
  const groups: { label: string; picks: typeof picks }[] = [];
  for (const pick of picks) {
    const label = monthLabel(pick.date);
    const last = groups[groups.length - 1];
    if (last && last.label === label) {
      last.picks.push(pick);
    } else {
      groups.push({ label, picks: [pick] });
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <p className="text-xs uppercase tracking-[0.2em] text-forest-light">The club's reading history</p>
      <h1 className="mt-1 text-3xl">Book of the Day Archive</h1>
      <p className="mt-2 max-w-xl text-parchment-light/70">
        Every pick we've pulled down from the shelf and put in the spotlight, in the order
        we read them.
      </p>

      {picks.length === 0 ? (
        <p className="mt-10 text-parchment-light/60">No picks yet — check back after the first one goes up.</p>
      ) : (
        <div className="relative mt-12">
          {/* The brass spine running down the timeline */}
          <div className="absolute bottom-0 left-[27px] top-2 hidden w-px bg-brass/30 sm:block" />

          <div className="space-y-14">
            {groups.map((group) => (
              <div key={group.label}>
                <h2 className="relative sm:pl-16">
                  <span className="hidden text-sm uppercase tracking-[0.2em] text-brass-light sm:inline">
                    {group.label}
                  </span>
                  <span className="text-lg text-parchment-light sm:hidden">{group.label}</span>
                </h2>

                <div className="mt-5 space-y-6">
                  {group.picks.map((pick) => {
                    const avg =
                      pick.book.reviews.length > 0
                        ? pick.book.reviews.reduce((s, r) => s + r.rating, 0) /
                          pick.book.reviews.length
                        : null;
                    return (
                      <FadeUp key={pick.id}>
                        <div className="relative sm:pl-16">
                          {/* Timeline node */}
                          <span className="absolute left-[23px] top-6 hidden h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 border-brass bg-walnut-dark sm:block" />

                          <Link href={`/books/${pick.book.id}`} className="card flex gap-4 p-4 hover:border-brass/60">
                            <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-sm shadow-spine">
                              <Image
                                src={pick.book.coverUrl}
                                alt={`Cover of ${pick.book.title}`}
                                fill
                                sizes="80px"
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs text-parchment-light/50">
                                {pick.date.toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </p>
                              <p className="mt-0.5 truncate font-display text-lg text-parchment-light hover:text-ember">
                                {pick.book.title}
                              </p>
                              <p className="text-sm text-parchment-light/60">{pick.book.author}</p>
                              <div className="mt-1">
                                <StarRatingDisplay rating={avg} />
                              </div>
                              {pick.note && (
                                <p className="mt-2 truncate text-xs italic text-parchment-light/60">
                                  "{pick.note}"
                                </p>
                              )}
                            </div>
                          </Link>
                        </div>
                      </FadeUp>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

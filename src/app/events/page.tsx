import { prisma } from "@/lib/prisma";

export default async function EventsPage() {
  const today = new Date(new Date().setHours(0, 0, 0, 0));

  const [events, pastEvents] = await Promise.all([
    prisma.event.findMany({
      where: { date: { gte: today } },
      orderBy: { date: "asc" },
    }),
    prisma.event.findMany({
      where: { date: { lt: today } },
      orderBy: { date: "desc" },
      take: 6,
    }),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-forest-light">Come say hello</p>
      <h1 className="mt-1 text-4xl">Meetups & Events</h1>
      <p className="mt-3 text-parchment-light/70">
        We meet regularly to talk about the current pick — no reading homework required to show up.
      </p>

      {events.length === 0 ? (
        <p className="mt-10 text-parchment-light/60">No events scheduled right now — check back soon.</p>
      ) : (
        <ul className="mt-8 space-y-5">
          {events.map((e) => (
            <li key={e.id} className="card flex gap-4 p-5">
              <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-sm bg-walnut text-parchment-light">
                <span className="font-display text-lg leading-none">
                  {e.date.getDate()}
                </span>
                <span className="text-[10px] uppercase tracking-wide">
                  {e.date.toLocaleString("en-US", { month: "short" })}
                </span>
              </div>
              <div>
                <h2 className="font-display text-lg text-parchment-light">{e.title}</h2>
                <p className="text-sm text-parchment-light/60">{e.location}</p>
                <p className="mt-2 text-sm text-parchment-light/90">{e.description}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {pastEvents.some((e) => e.recap) && (
        <div className="mt-14">
          <div className="shelf-divider" />
          <h2 className="mt-8 text-2xl">Past meetup recaps</h2>
          <ul className="mt-6 space-y-6">
            {pastEvents
              .filter((e) => e.recap)
              .map((e) => (
                <li key={e.id} className="card overflow-hidden p-0">
                  {e.recapImageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={e.recapImageUrl}
                      alt={`Photo from ${e.title}`}
                      className="h-56 w-full object-cover"
                    />
                  )}
                  <div className="p-5">
                    <h3 className="font-display text-lg text-parchment-light">{e.title}</h3>
                    <p className="text-sm text-parchment-light/60">
                      {e.date.toLocaleDateString()} &middot; {e.location}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-parchment-light/90">{e.recap}</p>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}

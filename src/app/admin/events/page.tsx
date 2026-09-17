import Link from "next/link";
import { prisma } from "@/lib/prisma";
import EventManagerList from "@/components/admin/EventManagerList";

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { date: "desc" },
    select: { id: true, title: true, date: true, location: true, recap: true },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl">Manage Events</h2>
        <Link href="/admin/events/new" className="btn-primary">
          Add an event
        </Link>
      </div>
      {events.length === 0 ? (
        <p className="text-parchment-light/60">No events yet — add the first one.</p>
      ) : (
        <EventManagerList
          events={events.map((e) => ({ ...e, date: e.date.toISOString() }))}
        />
      )}
    </div>
  );
}

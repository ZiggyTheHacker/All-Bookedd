import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EventForm from "@/components/admin/EventForm";

export default async function EditEventPage({ params }: { params: { id: string } }) {
  const event = await prisma.event.findUnique({ where: { id: params.id } });
  if (!event) notFound();

  return (
    <div>
      <h2 className="mb-6 text-xl">Edit &ldquo;{event.title}&rdquo;</h2>
      <EventForm
        eventId={event.id}
        initial={{
          title: event.title,
          description: event.description,
          date: event.date.toISOString().slice(0, 10),
          location: event.location,
          recap: event.recap ?? "",
          recapImageUrl: event.recapImageUrl ?? "",
        }}
      />
    </div>
  );
}

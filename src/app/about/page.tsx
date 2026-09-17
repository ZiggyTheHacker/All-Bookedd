export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-forest-light">Our story</p>
      <h1 className="mt-1 text-4xl">About All Booked</h1>
      <div className="mt-6 space-y-4 leading-relaxed text-parchment-light/90">
        <p>
          All Booked started as a shelf in the back corner of a secondhand shop and a
          standing Tuesday invitation to "come argue about a book with us." It's grown into a
          small club with one rule: every pick has to be something a member actually loved, not
          just something popular.
        </p>
        <p>
          Every day, we shelve one Book of the Day — chosen by a member, complete with the reason
          they picked it. You can browse the full catalog, sort it however makes sense to you,
          track what you're reading, and leave a review that other members will actually read.
        </p>
        <p>
          Membership is free. Log in, put a few books on your shelf, and join us at the next
          meetup — details are always on the Events page.
        </p>
      </div>
    </div>
  );
}

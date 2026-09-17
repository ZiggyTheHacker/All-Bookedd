export default function GamesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <div className="card mx-auto max-w-lg p-10">
        <p className="text-xs uppercase tracking-[0.2em] text-forest-light">Coming soon</p>
        <h1 className="mt-2 text-3xl">The Games Shelf</h1>
        <div className="mx-auto mt-6 flex w-fit gap-1">
          {["bg-oxblood", "bg-forest", "bg-brass-dark"].map((c, i) => (
            <div key={i} className={`${c} h-16 w-4 rounded-t-sm opacity-80`} />
          ))}
        </div>
        <p className="mt-6 leading-relaxed text-parchment-light/90">
          We're building a little corner for book trivia, "guess the plot," and reading
          challenges. Still under construction — check back soon.
        </p>
      </div>
    </div>
  );
}

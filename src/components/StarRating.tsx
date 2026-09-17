"use client";

export function StarRatingDisplay({ rating }: { rating: number | null }) {
  if (rating === null) return <span className="text-sm text-parchment-light/50">No ratings yet</span>;
  const rounded = Math.round(rating);
  return (
    <span className="text-brass" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {"★".repeat(rounded)}
      <span className="text-parchment-light/25">{"★".repeat(5 - rounded)}</span>
      <span className="ml-1 text-sm text-parchment-light/60">{rating.toFixed(1)}</span>
    </span>
  );
}

export function StarRatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          type="button"
          key={n}
          onClick={() => onChange(n)}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          className={`text-2xl leading-none ${n <= value ? "text-brass" : "text-parchment-light/25"}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

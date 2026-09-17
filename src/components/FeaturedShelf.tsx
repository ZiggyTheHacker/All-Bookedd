import Link from "next/link";

type FeaturedBook = {
  id: string;
  title: string;
  author: string;
  genre: string;
};

type Slot = {
  featured?: FeaturedBook;
  colorIndex: number;
  heightIndex: number;
};

const SPINE_COLORS = [
  "#B5502E", // burnt orange
  "#C9A15A", // mustard/brass
  "#4A6670", // slate teal
  "#7A2E2A", // oxblood
  "#8C6A3F", // warm walnut
  "#3F4A35", // deep forest
  "#D4B36A", // light brass
  "#5A3E2B", // walnut
];

const HEIGHTS = [150, 168, 178, 158, 172, 162];
const WIDTHS = [26, 34, 30, 38, 28, 32];

const SLOTS_PER_ROW = 11;
const SLOT_WIDTH = 48; // fixed px per slot — every position calc below is in these units
const ROW_WIDTH = SLOTS_PER_ROW * SLOT_WIDTH;
const TAG_WIDTH = 168; // matches the Tag component's fixed width below
const TAG_BAND_HEIGHT = 64; // vertical space reserved above/below a row for tags

function buildRow(featuredAtIndices: Record<number, FeaturedBook>, seedOffset: number): Slot[] {
  return Array.from({ length: SLOTS_PER_ROW }, (_, i) => ({
    featured: featuredAtIndices[i],
    colorIndex: (i + seedOffset) % SPINE_COLORS.length,
    heightIndex: (i * 3 + seedOffset) % HEIGHTS.length,
  }));
}

function Spine({ slot }: { slot: Slot }) {
  const color = SPINE_COLORS[slot.colorIndex];
  const height = HEIGHTS[slot.heightIndex];
  const width = WIDTHS[slot.heightIndex % WIDTHS.length];
  const isFeatured = !!slot.featured;

  const spine = (
    <div
      className="relative mx-auto rounded-t-sm transition-transform group-hover:-translate-y-1"
      style={{
        width,
        height,
        backgroundColor: color,
        boxShadow: isFeatured
          ? "0 0 0 2px #B8923F, 2px 2px 5px rgba(0,0,0,0.45)"
          : "2px 2px 5px rgba(0,0,0,0.35)",
      }}
    >
      <div
        className="absolute inset-x-1 top-4 h-1.5 rounded-full opacity-40"
        style={{ backgroundColor: "rgba(255,255,255,0.5)" }}
      />
      <div
        className="absolute inset-x-1 bottom-4 h-1 rounded-full opacity-30"
        style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
      />
    </div>
  );

  return (
    <div className="group flex flex-col items-end justify-end" style={{ width: SLOT_WIDTH }}>
      {isFeatured ? (
        <Link href={`/books/${slot.featured!.id}`} aria-label={slot.featured!.title}>
          {spine}
        </Link>
      ) : (
        spine
      )}
    </div>
  );
}

// `side` controls where the tag sits relative to its slot: centered above
// the spine, or offset to hang off its left/right shoulder — this is what
// keeps three tags on one shelf from reading as one crowded strip,
// especially with long titles.
type TagSide = "center" | "left" | "right";

function Tag({ book, hang, tilt }: { book: FeaturedBook; hang: boolean; tilt: number }) {
  return (
    <div className="flex flex-col items-center" style={{ width: TAG_WIDTH, transform: `rotate(${tilt}deg)` }}>
      {hang && <div className="h-2 w-px bg-brass/50" />}
      <Link
        href={`/books/${book.id}`}
        style={{ width: TAG_WIDTH }}
        className="pointer-events-auto flex flex-col items-center rounded-md bg-parchment-light px-3 py-1.5 text-center shadow-spine transition-transform hover:-translate-y-0.5"
      >
        <span className="w-full truncate font-display text-sm leading-tight text-walnut">
          {book.title}
        </span>
        <span className="w-full truncate text-[11px] text-walnut/60">
          {book.author} &middot; {book.genre}
        </span>
      </Link>
      {!hang && <div className="h-2 w-px bg-brass/50" />}
    </div>
  );
}

type TaggedSlot = { idx: number; book: FeaturedBook; side: TagSide; hang: boolean; tilt: number };

function TagBand({ slots, hang }: { slots: TaggedSlot[]; hang: boolean }) {
  if (slots.length === 0) return null;
  return (
    <div className="relative" style={{ width: ROW_WIDTH, height: TAG_BAND_HEIGHT }}>
      {slots.map(({ idx, book, side, tilt }) => {
        // Center of the target slot, in px, then nudged toward whichever
        // side this tag is assigned to so neighboring tags fan outward
        // instead of stacking in a single dead-center line.
        const slotCenter = idx * SLOT_WIDTH + SLOT_WIDTH / 2;
        const nudge = side === "left" ? -TAG_WIDTH * 0.3 : side === "right" ? TAG_WIDTH * 0.3 : 0;
        const left = Math.min(Math.max(slotCenter + nudge - TAG_WIDTH / 2, 0), ROW_WIDTH - TAG_WIDTH);
        return (
          <div
            key={book.id}
            className={`absolute ${hang ? "top-0" : "bottom-0"}`}
            style={{ left }}
          >
            <Tag book={book} hang={hang} tilt={tilt} />
          </div>
        );
      })}
    </div>
  );
}

export default function FeaturedShelf({ featured }: { featured: FeaturedBook[] }) {
  const picks = featured.slice(0, 6);

  // Spread featured books across two rows at fixed, well-separated indices
  // so tags never overlap each other.
  const row1Indices = [1, 5, 8];
  const row2Indices = [2, 6, 9];

  const row1Books = picks.slice(0, 3);
  const row2Books = picks.slice(3, 6);

  const row1Featured: Record<number, FeaturedBook> = {};
  const row2Featured: Record<number, FeaturedBook> = {};
  row1Books.forEach((b, i) => (row1Featured[row1Indices[i]] = b));
  row2Books.forEach((b, i) => (row2Featured[row2Indices[i]] = b));

  const row1 = buildRow(row1Featured, 0);
  const row2 = buildRow(row2Featured, 4);

  // Alternate each tag's placement — above the shelf / hanging below it —
  // and its horizontal lean, so a row of three tags fans out (one above
  // left, one below center, one above right) rather than lining up in a
  // single crowded band. The pattern is fixed, not random, so it's stable
  // across renders and doesn't jump around on refresh.
  const PLACEMENTS: { side: TagSide; hang: boolean; tilt: number }[] = [
    { side: "left", hang: false, tilt: -2 },
    { side: "center", hang: true, tilt: 0 },
    { side: "right", hang: false, tilt: 2 },
  ];

  function place(indices: number[], books: FeaturedBook[]): TaggedSlot[] {
    return books.map((book, i) => ({ idx: indices[i], book, ...PLACEMENTS[i % PLACEMENTS.length] }));
  }

  const row1Tags = place(row1Indices, row1Books);
  const row2Tags = place(row2Indices, row2Books);

  return (
    <div className="overflow-x-auto pb-2">
      <div className="mx-auto" style={{ width: ROW_WIDTH }}>
        <TagBand slots={row1Tags.filter((t) => !t.hang)} hang={false} />

        <div className="flex items-end" style={{ width: ROW_WIDTH }}>
          {row1.map((slot, i) => (
            <Spine key={i} slot={slot} />
          ))}
        </div>
        <div className="h-4 rounded-sm bg-walnut shadow-spine" style={{ width: ROW_WIDTH }} />
        <TagBand slots={row1Tags.filter((t) => t.hang)} hang />

        <div className="mt-6">
          <TagBand slots={row2Tags.filter((t) => !t.hang)} hang={false} />
        </div>

        <div className="flex items-end" style={{ width: ROW_WIDTH }}>
          {row2.map((slot, i) => (
            <Spine key={i} slot={slot} />
          ))}
        </div>
        <div className="h-4 rounded-sm bg-walnut shadow-spine" style={{ width: ROW_WIDTH }} />
        <TagBand slots={row2Tags.filter((t) => t.hang)} hang />
      </div>
      <p className="mt-2 text-center text-[11px] text-parchment-light/40 sm:hidden">
        Scroll sideways to see the whole shelf →
      </p>
    </div>
  );
}

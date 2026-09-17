"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

const GENRES = [
  "Historical Fiction",
  "Science Fiction",
  "Literary Fiction",
  "Mystery",
  "Fantasy",
];

export default function SortFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-1 flex-col gap-1">
        <label htmlFor="q" className="text-xs uppercase tracking-wide text-parchment-light/70">
          Search title or author
        </label>
        <input
          id="q"
          type="search"
          defaultValue={searchParams.get("q") ?? ""}
          onChange={(e) => updateParam("q", e.target.value)}
          placeholder="e.g. Ashworth, or 'orchard'"
          className="input-field"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="genre" className="text-xs uppercase tracking-wide text-parchment-light/70">
          Genre
        </label>
        <select
          id="genre"
          defaultValue={searchParams.get("genre") ?? ""}
          onChange={(e) => updateParam("genre", e.target.value)}
          className="input-field"
        >
          <option value="">All genres</option>
          {GENRES.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="sort" className="text-xs uppercase tracking-wide text-parchment-light/70">
          Sort by
        </label>
        <select
          id="sort"
          defaultValue={searchParams.get("sort") ?? "title"}
          onChange={(e) => updateParam("sort", e.target.value)}
          className="input-field"
        >
          <option value="title">Title (A–Z)</option>
          <option value="author">Author (A–Z)</option>
          <option value="newest">Recently added</option>
          <option value="year">Publication year</option>
        </select>
      </div>
    </div>
  );
}

"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import Link from "next/link";
import BookCard from "./BookCard";
import { AvatarBadge } from "./avatars";

type BookSummary = {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  genre: string;
  avgRating: number | null;
};

export default function ClimbingShelf({
  shelves,
  avatarId,
}: {
  shelves: { genre: string; books: BookSummary[] }[];
  avatarId: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.4"],
  });

  const top = useTransform(scrollYProgress, [0, 1], ["1%", "97%"]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-4, 4]);

  return (
    <div ref={containerRef} className="relative">
      {/* Ladder rail spanning the whole section */}
      <div className="absolute bottom-6 left-4 top-6 hidden w-6 sm:block" aria-hidden>
        <div className="absolute inset-y-0 left-0 w-[3px] rounded-full bg-brass/60" />
        <div className="absolute inset-y-0 left-4 w-[3px] rounded-full bg-brass/60" />
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-[3px] w-6 rounded-full bg-brass/40"
            style={{ top: `${(i / 15) * 100}%` }}
          />
        ))}
      </div>

      {/* Climbing avatar */}
      <motion.div
        className="absolute left-0 z-10 hidden sm:block"
        style={{ top }}
        aria-hidden
      >
        <motion.div style={{ rotate }}>
          <AvatarBadge id={avatarId} size={40} className="shadow-spine" />
        </motion.div>
      </motion.div>

      <div className="space-y-14 pl-0 sm:pl-16">
        {shelves.map((shelf) => (
          <section key={shelf.genre}>
            <div className="mb-4 flex items-baseline justify-between">
              <h3 className="font-display text-xl text-parchment-light">{shelf.genre}</h3>
              <Link
                href={`/books?genre=${encodeURIComponent(shelf.genre)}`}
                className="text-xs uppercase tracking-wide text-ember hover:underline"
              >
                See all
              </Link>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-4">
              {shelf.books.map((b) => (
                <div key={b.id} className="shrink-0">
                  <BookCard
                    id={b.id}
                    title={b.title}
                    author={b.author}
                    coverUrl={b.coverUrl}
                    genre={b.genre}
                    avgRating={b.avgRating}
                  />
                </div>
              ))}
            </div>
            <div className="shelf-divider" />
          </section>
        ))}
      </div>
    </div>
  );
}

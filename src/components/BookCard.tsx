"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { StarRatingDisplay } from "./StarRating";

type BookCardProps = {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  genre: string;
  avgRating: number | null;
};

export default function BookCard({ id, title, author, coverUrl, genre, avgRating }: BookCardProps) {
  return (
    <Link href={`/books/${id}`} className="group flex flex-col items-center">
      <motion.div
        className="relative h-56 w-36 overflow-hidden rounded-sm shadow-spine"
        whileHover={{ rotate: -4, y: -8, scale: 1.03 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        <Image
          src={coverUrl}
          alt={`Cover of ${title}`}
          fill
          sizes="144px"
          className="object-cover"
        />
      </motion.div>
      <div className="mt-3 w-40 text-center">
        <p className="font-display text-sm leading-snug text-parchment-light group-hover:text-ember">
          {title}
        </p>
        <p className="text-xs text-parchment-light/60">{author}</p>
        <p className="mt-1 text-[11px] uppercase tracking-wide text-forest-light">{genre}</p>
        <div className="mt-1 text-xs">
          <StarRatingDisplay rating={avgRating} />
        </div>
      </div>
    </Link>
  );
}

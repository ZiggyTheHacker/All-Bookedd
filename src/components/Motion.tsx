"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export function FadeUp({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export function LibraryLadder() {
  return (
    <motion.div
      className="pointer-events-none absolute -right-4 top-8 hidden w-16 sm:block md:w-20"
      initial={{ rotate: -3, y: 0 }}
      animate={{ rotate: [-3, 1, -3], y: [0, -6, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden
    >
      <svg viewBox="0 0 80 260" xmlns="http://www.w3.org/2000/svg">
        <line x1="14" y1="0" x2="4" y2="260" stroke="#8F701F" strokeWidth="6" strokeLinecap="round" />
        <line x1="66" y1="0" x2="76" y2="260" stroke="#8F701F" strokeWidth="6" strokeLinecap="round" />
        {Array.from({ length: 9 }).map((_, i) => {
          const y = 20 + i * 27;
          return (
            <line
              key={i}
              x1={9 + i * 0.6}
              y1={y}
              x2={71 - i * 0.6}
              y2={y}
              stroke="#B8923F"
              strokeWidth="5"
              strokeLinecap="round"
            />
          );
        })}
      </svg>
    </motion.div>
  );
}

// Subtle page-turn: a small rotate + slide-in used when navigating between
// book detail pages. Pass a `pageKey` (e.g. the book id) so React remounts
// — and therefore re-animates — the wrapper on each navigation.
export function PageTurn({ pageKey, children }: { pageKey: string; children: ReactNode }) {
  return (
    <motion.div
      key={pageKey}
      initial={{ opacity: 0, x: 24, rotateY: -6 }}
      animate={{ opacity: 1, x: 0, rotateY: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      style={{ transformPerspective: 1000 }}
    >
      {children}
    </motion.div>
  );
}

"use client";

import { useState, ReactNode } from "react";
import { motion, useAnimation } from "framer-motion";

export default function ShelfSpotlight({ children }: { children: ReactNode }) {
  const [lit, setLit] = useState(false);
  const controls = useAnimation();

  async function handlePull() {
    setLit((v) => !v);
    await controls.start({
      y: [0, 18, 0],
      transition: { duration: 0.5, ease: "easeInOut" },
    });
  }

  return (
    <div className="relative overflow-hidden rounded-md bg-ink pb-14 pt-2">
      {/* Warm spotlight glow, toggled by the pull cord */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-full transition-opacity duration-700"
        style={{
          opacity: lit ? 1 : 0,
          background:
            "radial-gradient(ellipse 55% 60% at 50% 0%, rgba(212,179,106,0.35), rgba(212,179,106,0.08) 45%, transparent 70%)",
        }}
      />

      {/* Ceiling mount + chain + bulb, all pulled together */}
      <div className="relative z-10 mx-auto mb-6 flex flex-col items-center">
        <div className="h-2 w-6 rounded-b-sm bg-brass-dark/60" />

        <motion.button
          type="button"
          onClick={handlePull}
          animate={controls}
          aria-pressed={lit}
          aria-label={lit ? "Pull to turn off the shelf light" : "Pull to turn on the shelf light"}
          className="group flex flex-col items-center"
        >
          {/* Chain links */}
          <svg width="14" height="30" viewBox="0 0 14 30" className="block">
            {[3, 11, 19].map((y) => (
              <ellipse
                key={y}
                cx="7"
                cy={y}
                rx="3.2"
                ry="4.2"
                fill="none"
                stroke={lit ? "#D4B36A" : "#8F701F"}
                strokeWidth="1.6"
                transform={y === 11 ? `rotate(90 7 ${y})` : undefined}
              />
            ))}
          </svg>

          {/* Bulb, at the end of the chain */}
          <svg
            width="34"
            height="34"
            viewBox="0 0 24 24"
            fill="none"
            className="-mt-1 transition-transform group-hover:scale-110"
          >
            <path
              d="M9 6h6M10 3h4M12 21a6 6 0 0 1 -3.7 -10.7c.6 -.5 1 -1.2 1 -2V7h5.4v1.3c0 .8 .4 1.5 1 2A6 6 0 0 1 12 21z"
              stroke={lit ? "#D4B36A" : "#8F701F"}
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill={lit ? "#D4B36A" : "none"}
              fillOpacity={lit ? 0.25 : 0}
            />
          </svg>
          <span className="mt-1 block text-center text-[11px] uppercase tracking-wide text-brass-light/70">
            {lit ? "Lights on" : "Pull the cord"}
          </span>
        </motion.button>
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}

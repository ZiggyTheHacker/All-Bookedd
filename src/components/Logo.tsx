export function LogoMark({ size = 40, color = "#B8923F" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path
        d="M4 8c3-2 7-2 10 0v16c-3-2-7-2-10 0V8z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M28 8c-3-2-7-2-10 0v16c3-2 7-2 10 0V8z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M14 10.5c0-.6.5-1 1-1M14 14.5c0-.6.5-1 1-1M14 18.5c0-.6.5-1 1-1" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M18 10.5c0-.6-.5-1-1-1M18 14.5c0-.6-.5-1-1-1M18 18.5c0-.6-.5-1-1-1" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

// Stands in for the "oo" in "Booked" — a small pair of round reading
// glasses, sized in em units so it scales with the surrounding text and
// sits inline with it via align-middle, the way the letters it replaces
// would have.
function GlassesO() {
  return (
    <svg
      viewBox="0 0 46 24"
      className="mx-[0.03em] inline-block h-[0.56em] w-[1.1em] align-middle text-brass-light"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="11.5" cy="12" r="9.5" stroke="currentColor" strokeWidth="2.8" />
      <circle cx="34.5" cy="12" r="9.5" stroke="currentColor" strokeWidth="2.8" />
      <path d="M21 10c1.2-1.8 3.2-1.8 4.4 0" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M2 11c-1.6-.2-2.4.5-2 2.4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M44 11c1.6-.2 2.4.5 2 2.4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export default function Logo({ size = 40 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-3">
      <LogoMark size={size} />
      <span className="font-display text-3xl text-brass-light">
        All B<GlassesO />ked
      </span>
    </span>
  );
}

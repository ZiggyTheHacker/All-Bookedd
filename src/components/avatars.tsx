export type AvatarId =
  | "warrior"
  | "magician"
  | "farmer"
  | "scholar"
  | "bard"
  | "explorer"
  | "baker"
  | "sailor"
  | "gardener"
  | "astronomer"
  | "painter"
  | "detective"
  | "guest";

type AvatarDef = {
  id: AvatarId;
  label: string;
  color: string; // badge background
  glyph: (props: { color: string }) => JSX.Element; // simple line icon
};

const glyphs: Record<Exclude<AvatarId, "guest">, AvatarDef["glyph"]> = {
  warrior: ({ color }) => (
    <path
      d="M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z"
      stroke={color}
      strokeWidth="1.6"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  magician: ({ color }) => (
    <g stroke={color} strokeWidth="1.6" strokeLinecap="round" fill="none">
      <path d="M6 19L18 7" />
      <path d="M15 7h3v3" />
      <path d="M6 19l-1 3 3-1" />
    </g>
  ),
  farmer: ({ color }) => (
    <g stroke={color} strokeWidth="1.6" strokeLinecap="round" fill="none">
      <path d="M4 20c3-6 6-8 8-8s5 2 8 8" />
      <circle cx="12" cy="8" r="3.2" />
    </g>
  ),
  scholar: ({ color }) => (
    <g stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d="M4 8l8-3 8 3-8 3-8-3z" />
      <path d="M8 10.5V15c0 1 2 2 4 2s4-1 4-2v-4.5" />
    </g>
  ),
  bard: ({ color }) => (
    <g stroke={color} strokeWidth="1.6" strokeLinecap="round" fill="none">
      <circle cx="9" cy="16" r="3" />
      <path d="M12 16V5l6-1.5V13" />
    </g>
  ),
  explorer: ({ color }) => (
    <g stroke={color} strokeWidth="1.6" fill="none">
      <circle cx="12" cy="12" r="8" />
      <path d="M15 9l-2 6-6 2 2-6 6-2z" strokeLinejoin="round" />
    </g>
  ),
  baker: ({ color }) => (
    <g stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d="M5 20h14" />
      <path d="M6 20c0-5 1-9 6-9s6 4 6 9" />
      <path d="M9 11c0-2 1-3 1-5M12 11c0-2 1-4 1-6M15 11c0-2 1-3 1-5" />
    </g>
  ),
  sailor: ({ color }) => (
    <g stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d="M12 3v11" />
      <path d="M6 8h12" />
      <path d="M4 20c2-4 5-5 8-5s6 1 8 5" />
    </g>
  ),
  gardener: ({ color }) => (
    <g stroke={color} strokeWidth="1.6" strokeLinecap="round" fill="none">
      <path d="M12 21V10" />
      <path d="M12 10c-4 0-6-2-6-6 4 0 6 2 6 6z" />
      <path d="M12 13c4 0 6-2 6-6-4 0-6 2-6 6z" />
    </g>
  ),
  astronomer: ({ color }) => (
    <g stroke={color} strokeWidth="1.6" fill="none">
      <circle cx="12" cy="12" r="4" />
      <path d="M3 15c4 2 14 2 18 0" strokeLinecap="round" />
      <circle cx="17" cy="7" r="1" fill={color} stroke="none" />
    </g>
  ),
  painter: ({ color }) => (
    <g stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d="M4 17c0-6 4-10 10-10 3 0 6 2 6 5 0 2-1 3-3 3h-2c-1 0-1 1-1 2 0 2-2 4-4 4-4 0-6-2-6-4z" />
      <circle cx="9" cy="12" r="0.8" fill={color} stroke="none" />
      <circle cx="13" cy="10" r="0.8" fill={color} stroke="none" />
    </g>
  ),
  detective: ({ color }) => (
    <g stroke={color} strokeWidth="1.6" strokeLinecap="round" fill="none">
      <circle cx="10" cy="10" r="5" />
      <path d="M14 14l5 5" />
    </g>
  ),
};

const meta: Record<Exclude<AvatarId, "guest">, { label: string; color: string }> = {
  warrior: { label: "Warrior", color: "#7A2E2A" },
  magician: { label: "Magician", color: "#3F4A35" },
  farmer: { label: "Farmer", color: "#8F701F" },
  scholar: { label: "Scholar", color: "#3E2A1E" },
  bard: { label: "Bard", color: "#93413C" },
  explorer: { label: "Explorer", color: "#57654A" },
  baker: { label: "Baker", color: "#B8923F" },
  sailor: { label: "Sailor", color: "#2A1C13" },
  gardener: { label: "Gardener", color: "#3F4A35" },
  astronomer: { label: "Astronomer", color: "#3E2A1E" },
  painter: { label: "Painter", color: "#7A2E2A" },
  detective: { label: "Detective", color: "#5A3E2B" },
};

export const AVATAR_IDS = Object.keys(meta) as Exclude<AvatarId, "guest">[];

export function AvatarBadge({
  id,
  size = 36,
  className = "",
}: {
  id: string;
  size?: number;
  className?: string;
}) {
  if (id === "guest") {
    return (
      <span
        className={`inline-flex shrink-0 items-center justify-center rounded-full border-2 border-walnut/30 bg-parchment ${className}`}
        style={{ width: size, height: size }}
        title="Guest"
      >
        <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none">
          <path d="M4 8c3-2 7-2 10 0v10c-3-2-7-2-10 0V8z" stroke="#3E2A1E" strokeOpacity="0.5" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M20 8c-3-2-7-2-10 0v10c3-2 7-2 10 0V8z" stroke="#3E2A1E" strokeOpacity="0.5" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      </span>
    );
  }

  const key = (AVATAR_IDS.includes(id as any) ? id : "scholar") as Exclude<AvatarId, "guest">;
  const { color } = meta[key];
  const Glyph = glyphs[key];
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full border-2 border-brass bg-parchment-light ${className}`}
      style={{ width: size, height: size }}
      title={meta[key].label}
    >
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24">
        <Glyph color={color} />
      </svg>
    </span>
  );
}

export function avatarLabel(id: string) {
  const key = (AVATAR_IDS.includes(id as any) ? id : "scholar") as Exclude<AvatarId, "guest">;
  return meta[key].label;
}

"use client";

import { AVATAR_IDS, AvatarBadge, avatarLabel } from "./avatars";

export default function AvatarPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-sm text-parchment-light/70">Choose your avatar</p>
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
        {AVATAR_IDS.map((id) => (
          <button
            type="button"
            key={id}
            onClick={() => onChange(id)}
            className={`flex flex-col items-center gap-1 rounded-sm p-2 transition-colors ${
              value === id ? "bg-brass/20 ring-1 ring-brass" : "hover:bg-brass/10"
            }`}
          >
            <AvatarBadge id={id} size={44} />
            <span className="text-[10px] text-parchment-light/70">{avatarLabel(id)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

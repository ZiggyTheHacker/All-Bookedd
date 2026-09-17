"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import AvatarPicker from "./AvatarPicker";

export default function ProfileAvatarEditor({ initialAvatar }: { initialAvatar: string }) {
  const router = useRouter();
  const { update } = useSession();
  const [avatar, setAvatar] = useState(initialAvatar);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  async function save(id: string) {
    setAvatar(id);
    setSaving(true);
    await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ avatar: id }),
    });
    await update(); // refreshes the client-side session so the navbar updates right away
    setSaving(false);
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="btn-secondary mt-3 px-3 py-1.5 text-sm"
      >
        Change avatar
      </button>
    );
  }

  return (
    <div className="mt-3">
      <AvatarPicker value={avatar} onChange={save} />
      {saving && <p className="mt-1 text-xs text-parchment-light/60">Saving…</p>}
    </div>
  );
}

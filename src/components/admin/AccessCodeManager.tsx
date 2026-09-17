"use client";

import { useState } from "react";

export default function AccessCodeManager({ initialCode }: { initialCode: string }) {
  const [code, setCode] = useState(initialCode);
  const [saved, setSaved] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessCode: code }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      return;
    }
    setCode(data.accessCode);
    setSaved(true);
    setMessage("Access code updated. Share the new code with anyone who still needs to join.");
  }

  return (
    <form onSubmit={handleSubmit} className="card max-w-sm space-y-3 p-6">
      <div>
        <label className="mb-1 block text-sm text-parchment-light/70">
          Club access code
        </label>
        <input
          required
          minLength={4}
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setSaved(false);
            setMessage("");
          }}
          className="input-field font-mono tracking-widest"
        />
        <p className="mt-1 text-xs text-parchment-light/50">
          New members must enter this on the registration page. Changing it doesn't affect
          anyone who's already joined.
        </p>
      </div>
      {error && <p className="text-sm text-ember">{error}</p>}
      {message && <p className="text-sm text-forest-light">{message}</p>}
      <button
        type="submit"
        disabled={saving || saved}
        className="btn-primary disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save code"}
      </button>
    </form>
  );
}

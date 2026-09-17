"use client";

import { useState } from "react";

export default function PasswordField({
  value,
  onChange,
  minLength,
  label = "Password",
}: {
  value: string;
  onChange: (v: string) => void;
  minLength?: number;
  label?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label className="mb-1 block text-sm text-parchment-light/70">{label}</label>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          required
          minLength={minLength}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input-field pr-11"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-parchment-light/60 hover:text-ember"
        >
          {visible ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 3l18 18" strokeLinecap="round" />
              <path d="M10.6 10.6a2 2 0 002.8 2.8" strokeLinecap="round" />
              <path d="M9.5 5.4A10.6 10.6 0 0112 5c5.5 0 9 4.5 10 7-.4.9-1.1 2-2.1 3M6.7 6.7C4.6 8.1 3 10 2 12c1 2.5 4.5 7 10 7 1.2 0 2.3-.2 3.3-.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M2 12c1-2.5 4.5-7 10-7s9 4.5 10 7c-1 2.5-4.5 7-10 7s-9-4.5-10-7z" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    setSent(true);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="card p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-forest-light">Account recovery</p>
        <h1 className="mt-1 text-3xl">Forgot Password</h1>

        {sent ? (
          <p className="mt-6 text-sm text-parchment-light/90">
            If <span className="font-semibold">{email}</span> has an account with us, a reset
            link is on its way. It expires in an hour — check your spam folder if it doesn't
            show up in a minute or two.
          </p>
        ) : (
          <>
            <p className="mt-2 text-sm text-parchment-light/70">
              Enter the email on your account and we'll send you a link to choose a new
              password.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm text-parchment-light/70">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
                {loading ? "Sending…" : "Send reset link"}
              </button>
            </form>
          </>
        )}

        <p className="mt-6 text-center text-sm text-parchment-light/70">
          <Link href="/login" className="font-semibold text-ember hover:underline">
            Back to log in
          </Link>
        </p>
      </div>
    </div>
  );
}

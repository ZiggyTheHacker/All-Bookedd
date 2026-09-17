"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PasswordField from "@/components/PasswordField";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("That email and password don't match our records.");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="card p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-forest-light">Welcome back</p>
        <h1 className="mt-1 text-3xl">Log In</h1>

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
          <PasswordField value={password} onChange={setPassword} />
          <p className="-mt-2 text-right text-sm">
            <Link href="/forgot-password" className="text-parchment-light/60 hover:text-ember hover:underline">
              Forgot password?
            </Link>
          </p>
          {error && <p className="text-sm text-ember">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-walnut/15" />
          <span className="text-xs uppercase tracking-wide text-parchment-light/50">or</span>
          <div className="h-px flex-1 bg-walnut/15" />
        </div>

        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="flex w-full items-center justify-center gap-2 rounded-sm border border-walnut/30 bg-parchment-light px-4 py-2.5 text-sm text-ink hover:bg-brass/10"
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8 3l6-6C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.4-.1-2.5-.4-3.5z" />
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3.1 0 5.9 1.1 8 3l6-6C34.6 6.1 29.6 4 24 4c-7.4 0-13.8 4.1-17.7 10.7z" />
            <path fill="#4CAF50" d="M24 45c5.5 0 10.4-1.9 14.2-5.1l-6.6-5.4C29.6 36.2 27 37 24 37c-5.2 0-9.6-3.3-11.2-7.9l-6.6 5.1C9.9 40.7 16.4 45 24 45z" />
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.6 5.4C41.6 36 44 30.5 44 24c0-1.4-.1-2.5-.4-3.5z" />
          </svg>
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-parchment-light/70">
          New here?{" "}
          <Link href="/register" className="font-semibold text-ember hover:underline">
            Join the club
          </Link>
        </p>
      </div>
    </div>
  );
}

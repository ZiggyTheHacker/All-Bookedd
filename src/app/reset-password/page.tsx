"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import PasswordField from "@/components/PasswordField";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      return;
    }
    setDone(true);
    setTimeout(() => router.push("/login"), 2000);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="card p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-forest-light">Account recovery</p>
        <h1 className="mt-1 text-3xl">Choose a New Password</h1>

        {!token ? (
          <p className="mt-6 text-sm text-ember">
            This link is missing its token. Request a new one from the{" "}
            <Link href="/forgot-password" className="font-semibold underline">
              forgot password
            </Link>{" "}
            page.
          </p>
        ) : done ? (
          <p className="mt-6 text-sm text-forest-light">
            Password updated. Taking you to the login page…
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <PasswordField value={password} onChange={setPassword} minLength={6} label="New password" />
            <p className="-mt-2 text-xs text-parchment-light/50">At least 6 characters.</p>
            {error && <p className="text-sm text-ember">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
              {loading ? "Saving…" : "Save new password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

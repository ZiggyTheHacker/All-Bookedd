"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PasswordField from "@/components/PasswordField";
import AvatarPicker from "@/components/AvatarPicker";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [avatar, setAvatar] = useState("scholar");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, avatar, accessCode }),
    });
    const data = await res.json();

    if (!res.ok) {
      setLoading(false);
      setError(data.error || "Something went wrong.");
      return;
    }

    const signInRes = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (signInRes?.error) {
      router.push("/login");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <div className="card p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-forest-light">New member</p>
        <h1 className="mt-1 text-3xl">Join the Club</h1>
        <p className="mt-2 text-sm text-parchment-light/70">
          All Booked is a private club. You'll need the access code from a current member to
          create an account.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm text-parchment-light/70">Access code</label>
            <input
              type="text"
              required
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="Ask a club member"
              className="input-field font-mono tracking-widest"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-parchment-light/70">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
            />
          </div>
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
          <PasswordField value={password} onChange={setPassword} minLength={6} />
          <p className="-mt-2 text-xs text-parchment-light/50">At least 6 characters.</p>
          <AvatarPicker value={avatar} onChange={setAvatar} />
          {error && <p className="text-sm text-ember">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-parchment-light/70">
          Already a member?{" "}
          <Link href="/login" className="font-semibold text-ember hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

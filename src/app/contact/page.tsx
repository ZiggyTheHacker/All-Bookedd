"use client";

import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-forest-light">We'd love to hear from you</p>
      <h1 className="mt-1 text-4xl">Say Hello</h1>
      <p className="mt-3 text-parchment-light/70">
        Questions about membership, book suggestions, or just want to talk about a book? Send us a note.
      </p>

      {sent ? (
        <div className="card mt-8 p-6 text-forest-light">
          Thanks — your note has been noted. We reply within a couple of days.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="card mt-8 space-y-4 p-6">
          <div>
            <label className="mb-1 block text-sm text-parchment-light/70">Name</label>
            <input
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
          <div>
            <label className="mb-1 block text-sm text-parchment-light/70">Message</label>
            <textarea
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="input-field"
            />
          </div>
          <button type="submit" className="btn-primary">
            Send message
          </button>
        </form>
      )}
    </div>
  );
}

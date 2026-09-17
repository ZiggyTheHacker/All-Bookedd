"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type BookFormValues = {
  title: string;
  author: string;
  coverUrl: string;
  genre: string;
  description: string;
  publishedYear: number | string;
  pages: number | string;
  fileUrl: string;
};

const GENRES = [
  "Historical Fiction",
  "Science Fiction",
  "Literary Fiction",
  "Mystery",
  "Fantasy",
  "Non-Fiction",
  "Poetry",
];

export default function BookForm({
  bookId,
  initial,
}: {
  bookId?: string;
  initial?: BookFormValues;
}) {
  const router = useRouter();
  const [values, setValues] = useState<BookFormValues>(
    initial ?? {
      title: "",
      author: "",
      coverUrl: "",
      genre: GENRES[0],
      description: "",
      publishedYear: new Date().getFullYear(),
      pages: 300,
      fileUrl: "",
    }
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  function update<K extends keyof BookFormValues>(key: K, value: BookFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch(bookId ? `/api/books/${bookId}` : "/api/books", {
      method: bookId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong.");
      return;
    }
    router.push("/admin/books");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4 p-6">
      <div>
        <label className="mb-1 block text-sm text-parchment-light/70">Title</label>
        <input
          required
          value={values.title}
          onChange={(e) => update("title", e.target.value)}
          className="input-field"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-parchment-light/70">Author</label>
        <input
          required
          value={values.author}
          onChange={(e) => update("author", e.target.value)}
          className="input-field"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-parchment-light/70">Cover image URL</label>
        <input
          required
          value={values.coverUrl}
          onChange={(e) => update("coverUrl", e.target.value)}
          placeholder="https://covers.openlibrary.org/b/id/xxxx-L.jpg"
          className="input-field"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm text-parchment-light/70">Genre</label>
          <select
            value={values.genre}
            onChange={(e) => update("genre", e.target.value)}
            className="input-field"
          >
            {GENRES.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm text-parchment-light/70">Published year</label>
          <input
            type="number"
            required
            value={values.publishedYear}
            onChange={(e) => update("publishedYear", e.target.value)}
            className="input-field"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm text-parchment-light/70">Pages</label>
        <input
          type="number"
          required
          value={values.pages}
          onChange={(e) => update("pages", e.target.value)}
          className="input-field"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-parchment-light/70">Description</label>
        <textarea
          required
          rows={4}
          value={values.description}
          onChange={(e) => update("description", e.target.value)}
          className="input-field"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-parchment-light/70">
          Book file (optional — lets members read/download)
        </label>
        {values.fileUrl && (
          <p className="mb-2 truncate text-xs text-forest-light">
            Current file attached — uploading a new one replaces it.
          </p>
        )}
        <input
          type="file"
          accept=".pdf,.epub,application/pdf,application/epub+zip"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setUploading(true);
            setError("");
            const body = new FormData();
            body.append("file", file);
            const res = await fetch("/api/admin/upload", { method: "POST", body });
            const data = await res.json();
            setUploading(false);
            if (!res.ok) {
              setError(data.error || "Upload failed.");
              return;
            }
            update("fileUrl", data.url);
          }}
          className="block w-full text-sm text-parchment-light file:mr-3 file:rounded-sm file:border-0 file:bg-oxblood file:px-4 file:py-2 file:text-parchment-light hover:file:bg-oxblood-light"
        />
        {uploading && <p className="mt-1 text-xs text-parchment-light/60">Uploading…</p>}
        <p className="mt-1 text-xs text-parchment-light/50">
          PDF or EPUB, up to 50MB. Only upload files you have the right to share — public
          domain works, your own writing, or books your club has permission to distribute.
        </p>
      </div>
      {error && <p className="text-sm text-ember">{error}</p>}
      <button type="submit" disabled={loading || uploading} className="btn-primary disabled:opacity-60">
        {loading ? "Saving…" : bookId ? "Save changes" : "Add book"}
      </button>
    </form>
  );
}

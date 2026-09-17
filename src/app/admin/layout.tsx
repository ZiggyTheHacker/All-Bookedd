import Link from "next/link";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/books", label: "Manage books" },
  { href: "/admin/book-of-day", label: "Book of the day" },
  { href: "/admin/quotes", label: "Quote of the day" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/requests", label: "Book requests" },
  { href: "/admin/users", label: "Members" },
  { href: "/admin/settings", label: "Club settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-xs uppercase tracking-[0.2em] text-forest-light">Staff only</p>
      <h1 className="mt-1 text-3xl">Admin Dashboard</h1>

      <div className="mt-8 grid gap-8 md:grid-cols-[200px_1fr]">
        <nav className="flex gap-2 overflow-x-auto md:flex-col">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="whitespace-nowrap rounded-sm border border-brass/30 px-3 py-2 text-sm text-parchment-light hover:bg-brass/10 md:whitespace-normal"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div>{children}</div>
      </div>
    </div>
  );
}

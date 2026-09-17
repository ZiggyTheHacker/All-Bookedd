"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { AvatarBadge } from "./avatars";
import Logo from "./Logo";

type DropdownItem = { label: string; href: string };

const browseItems: DropdownItem[] = [
  { label: "All books", href: "/books" },
  { label: "Book of the day", href: "/#book-of-the-day" },
  { label: "By genre: Fantasy", href: "/books?genre=Fantasy" },
  { label: "By genre: Mystery", href: "/books?genre=Mystery" },
  { label: "Newest arrivals", href: "/books?sort=newest" },
];

const clubItems: DropdownItem[] = [
  { label: "Meetups & events", href: "/events" },
  { label: "Book of the Day archive", href: "/archive" },
  { label: "About the club", href: "/about" },
  { label: "Request a book", href: "/requests" },
  { label: "Say hello", href: "/contact" },
];

function Dropdown({ label, items }: { label: string; items: DropdownItem[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className="px-3 py-2 font-display text-sm tracking-wide text-parchment-light hover:text-brass-light"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        {label}
      </button>
      {open && (
        <div className="absolute left-0 top-full w-56 origin-top rounded-b-sm border border-t-0 border-brass/40 bg-walnut-dark py-1 shadow-spine">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-2 text-sm text-parchment-light hover:bg-brass/15 hover:text-brass-light"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const { data: session } = useSession();
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b-4 border-brass bg-walnut shadow-spine">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Dropdown label="Browse" items={browseItems} />
          <Dropdown label="Club" items={clubItems} />
          <Link
            href="/games"
            className="px-3 py-2 font-display text-sm tracking-wide text-parchment-light hover:text-brass-light"
          >
            Games
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setAccountOpen(true)}
            onMouseLeave={() => setAccountOpen(false)}
          >
            <button
              className="flex items-center gap-2 px-3 py-2 font-display text-sm tracking-wide text-parchment-light hover:text-brass-light"
              onClick={() => setAccountOpen((o) => !o)}
            >
              {session && <AvatarBadge id={session.user.avatar} size={26} />}
              {session ? session.user.name.split(" ")[0] : "Account"}
            </button>
            {accountOpen && (
              <div className="absolute right-0 top-full w-52 rounded-b-sm border border-t-0 border-brass/40 bg-walnut-dark py-1 shadow-spine">
                {session ? (
                  <>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-parchment-light hover:bg-brass/15 hover:text-brass-light"
                    >
                      My shelf
                    </Link>
                    <Link
                      href="/account"
                      className="block px-4 py-2 text-sm text-parchment-light hover:bg-brass/15 hover:text-brass-light"
                    >
                      Account settings
                    </Link>
                    {session.user.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-sm text-parchment-light hover:bg-brass/15 hover:text-brass-light"
                      >
                        Admin dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="block w-full px-4 py-2 text-left text-sm text-parchment-light hover:bg-brass/15 hover:text-brass-light"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block px-4 py-2 text-sm text-parchment-light hover:bg-brass/15 hover:text-brass-light"
                    >
                      Log in
                    </Link>
                    <Link
                      href="/register"
                      className="block px-4 py-2 text-sm text-parchment-light hover:bg-brass/15 hover:text-brass-light"
                    >
                      Join the club
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </nav>

        {/* Mobile menu toggle */}
        <button
          className="flex items-center gap-2 text-parchment-light md:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {session && <AvatarBadge id={session.user.avatar} size={24} />}
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            {mobileOpen ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="border-t border-brass/40 bg-walnut-dark px-4 py-3 md:hidden">
          <p className="mt-2 px-1 text-[11px] uppercase tracking-wide text-brass-light/70">Browse</p>
          {browseItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-sm px-2 py-2 text-sm text-parchment-light hover:bg-brass/15"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          <p className="mt-3 px-1 text-[11px] uppercase tracking-wide text-brass-light/70">Club</p>
          {clubItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-sm px-2 py-2 text-sm text-parchment-light hover:bg-brass/15"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          <Link
            href="/games"
            className="mt-3 block rounded-sm px-2 py-2 text-sm text-parchment-light hover:bg-brass/15"
            onClick={() => setMobileOpen(false)}
          >
            Games
          </Link>

          <div className="mt-3 border-t border-brass/30 pt-3">
            {session ? (
              <>
                <Link
                  href="/profile"
                  className="block rounded-sm px-2 py-2 text-sm text-parchment-light hover:bg-brass/15"
                  onClick={() => setMobileOpen(false)}
                >
                  My shelf
                </Link>
                <Link
                  href="/account"
                  className="block rounded-sm px-2 py-2 text-sm text-parchment-light hover:bg-brass/15"
                  onClick={() => setMobileOpen(false)}
                >
                  Account settings
                </Link>
                {session.user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="block rounded-sm px-2 py-2 text-sm text-parchment-light hover:bg-brass/15"
                    onClick={() => setMobileOpen(false)}
                  >
                    Admin dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="block w-full rounded-sm px-2 py-2 text-left text-sm text-parchment-light hover:bg-brass/15"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block rounded-sm px-2 py-2 text-sm text-parchment-light hover:bg-brass/15"
                  onClick={() => setMobileOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="block rounded-sm px-2 py-2 text-sm text-parchment-light hover:bg-brass/15"
                  onClick={() => setMobileOpen(false)}
                >
                  Join the club
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

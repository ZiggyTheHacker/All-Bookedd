import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t-4 border-brass bg-walnut text-parchment-light">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <p className="font-display text-lg text-brass-light">All Booked</p>
          <p className="mt-2 text-sm text-parchment/80">
            A small club for people who dog-ear their favorite pages on purpose.
          </p>
        </div>
        <div>
          <p className="mb-2 font-display text-sm text-brass-light">Explore</p>
          <ul className="space-y-1 text-sm text-parchment/80">
            <li><Link href="/books" className="hover:text-brass-light">Browse books</Link></li>
            <li><Link href="/events" className="hover:text-brass-light">Events</Link></li>
            <li><Link href="/about" className="hover:text-brass-light">About</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-2 font-display text-sm text-brass-light">Get in touch</p>
          <ul className="space-y-1 text-sm text-parchment/80">
            <li><Link href="/contact" className="hover:text-brass-light">Contact us</Link></li>
            <li><Link href="/register" className="hover:text-brass-light">Join the club</Link></li>
          </ul>
        </div>
      </div>
      <p className="border-t border-brass/30 py-4 text-center text-xs text-parchment/60">
        &copy; {new Date().getFullYear()} All Booked Book Club.
      </p>
    </footer>
  );
}

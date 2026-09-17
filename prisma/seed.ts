import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.clubSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton", accessCode: "572157" },
  });

  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@allbooked.club" },
    update: {},
    create: {
      name: "Marguerite Voss",
      email: "admin@allbooked.club",
      passwordHash: adminPassword,
      role: "ADMIN",
      bio: "Founder & head librarian of All Booked.",
    },
  });

  const memberPassword = await bcrypt.hash("member123", 10);
  const member = await prisma.user.upsert({
    where: { email: "member@allbooked.club" },
    update: {},
    create: {
      name: "Theo Marsh",
      email: "member@allbooked.club",
      passwordHash: memberPassword,
      role: "MEMBER",
      bio: "Reads mysteries with tea, always.",
    },
  });

  const books = [
    {
      title: "The Cartographer's Daughter",
      author: "Elena Ashworth",
      coverUrl: "https://covers.openlibrary.org/b/id/8235112-L.jpg",
      genre: "Historical Fiction",
      description:
        "A mapmaker's daughter in 1890s Lisbon inherits an unfinished atlas that may lead to a city no one can prove exists.",
      publishedYear: 2019,
      pages: 342,
    },
    {
      title: "Static and Silence",
      author: "Marcus Odell",
      coverUrl: "https://covers.openlibrary.org/b/id/10521270-L.jpg",
      genre: "Science Fiction",
      description:
        "The last radio operator on a dying orbital station starts receiving a signal from a station that was decommissioned decades ago.",
      publishedYear: 2022,
      pages: 288,
    },
    {
      title: "The Orchard of Small Mercies",
      author: "Priya Nandakumar",
      coverUrl: "https://covers.openlibrary.org/b/id/12003842-L.jpg",
      genre: "Literary Fiction",
      description:
        "Three sisters return to their late grandmother's orchard and are forced to reckon with the debts, secrets, and recipes she left behind.",
      publishedYear: 2021,
      pages: 310,
    },
    {
      title: "A Ledger of Knives",
      author: "Bram Castellan",
      coverUrl: "https://covers.openlibrary.org/b/id/7222246-L.jpg",
      genre: "Mystery",
      description:
        "A forensic accountant is pulled into a murder investigation when the victim's spreadsheets turn out to be a confession in disguise.",
      publishedYear: 2020,
      pages: 276,
    },
    {
      title: "Where the Ferns Remember",
      author: "Ingrid Solvang",
      coverUrl: "https://covers.openlibrary.org/b/id/9251580-L.jpg",
      genre: "Fantasy",
      description:
        "In a valley where the forest keeps a physical memory of every promise ever made, a young oath-breaker must undo a vow her mother made before she was born.",
      publishedYear: 2023,
      pages: 402,
    },
    {
      title: "The Quiet Mechanics of Grief",
      author: "Daniel Voss",
      coverUrl: "https://covers.openlibrary.org/b/id/8406786-L.jpg",
      genre: "Literary Fiction",
      description:
        "A watchmaker rebuilds his late wife's favorite clock, one part at a time, in a novel about repair as a form of mourning.",
      publishedYear: 2018,
      pages: 224,
    },
  ];

  const createdBooks = [];
  for (const b of books) {
    const book = await prisma.book.upsert({
      where: { id: b.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") },
      update: {},
      create: { id: b.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"), ...b },
    });
    createdBooks.push(book);
  }

  // Book of the day: today's pick
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  await prisma.featuredBook.upsert({
    where: { date: today },
    update: { bookId: createdBooks[0].id },
    create: {
      date: today,
      bookId: createdBooks[0].id,
      note: "Chosen by Marguerite for its map that turns out to be a love letter.",
    },
  });

  await prisma.event.createMany({
    data: [
      {
        title: "October Fireside Discussion: The Cartographer's Daughter",
        description:
          "Bring a warm drink — we're talking unreliable narrators and the ethics of inherited secrets.",
        date: new Date(new Date().setDate(new Date().getDate() + 14)),
        location: "All Booked, back room",
      },
      {
        title: "New Member Tea & Shelf Tour",
        description:
          "A casual meetup for anyone who's joined in the last month. No reading required.",
        date: new Date(new Date().setDate(new Date().getDate() + 28)),
        location: "All Booked, front parlor",
      },
    ],
    skipDuplicates: true,
  });

  await prisma.quote.createMany({
    data: [
      { text: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.", author: "Jane Austen", book: "Pride and Prejudice" },
      { text: "All happy families are alike; each unhappy family is unhappy in its own way.", author: "Leo Tolstoy", book: "Anna Karenina" },
      { text: "It was the best of times, it was the worst of times.", author: "Charles Dickens", book: "A Tale of Two Cities" },
      { text: "Whatever our souls are made of, his and mine are the same.", author: "Emily Brontë", book: "Wuthering Heights" },
      { text: "We are all fools in love.", author: "Jane Austen", book: "Pride and Prejudice" },
      { text: "I am no bird; and no net ensnares me.", author: "Charlotte Brontë", book: "Jane Eyre" },
      { text: "The only way out of the labyrinth of suffering is to forgive.", author: "John Green", book: "Looking for Alaska" },
      { text: "Not all those who wander are lost.", author: "J.R.R. Tolkien", book: "The Fellowship of the Ring" },
      { text: "To live will be an awfully big adventure.", author: "J.M. Barrie", book: "Peter Pan" },
      { text: "It does not do to dwell on dreams and forget to live.", author: "J.K. Rowling", book: "Harry Potter and the Philosopher's Stone" },
      { text: "I can't go back to yesterday because I was a different person then.", author: "Lewis Carroll", book: "Alice's Adventures in Wonderland" },
      { text: "There is some good in this world, and it's worth fighting for.", author: "J.R.R. Tolkien", book: "The Two Towers" },
      { text: "Words are, in my not-so-humble opinion, our most inexhaustible source of magic.", author: "J.K. Rowling", book: "Harry Potter and the Deathly Hallows" },
      { text: "The world breaks everyone, and afterward, some are strong at the broken places.", author: "Ernest Hemingway", book: "A Farewell to Arms" },
      { text: "So we beat on, boats against the current, borne back ceaselessly into the past.", author: "F. Scott Fitzgerald", book: "The Great Gatsby" },
      { text: "I took a deep breath and listened to the old brag of my heart.", author: "Sylvia Plath", book: "The Bell Jar" },
      { text: "There is no greater agony than bearing an untold story inside you.", author: "Maya Angelou", book: null },
      { text: "The past is never dead. It's not even past.", author: "William Faulkner", book: "Requiem for a Nun" },
      { text: "You must not lose faith in humanity. Humanity is an ocean.", author: "Mahatma Gandhi", book: null },
      { text: "A room without books is like a body without a soul.", author: "Marcus Tullius Cicero", book: null },
    ],
    skipDuplicates: true,
  });

  // BookRequest has no natural unique field, so these use find-or-create
  // instead of createMany(skipDuplicates) to stay idempotent across reseeds
  // and to let us grab the id for seeding a demo vote below.
  let piranesiRequest = await prisma.bookRequest.findFirst({ where: { title: "Piranesi" } });
  if (!piranesiRequest) {
    piranesiRequest = await prisma.bookRequest.create({
      data: {
        title: "Piranesi",
        author: "Susanna Clarke",
        reason: "Heard it's strange and beautiful — perfect for a slower month.",
        requestedById: member.id,
      },
    });
  }

  let hailMaryRequest = await prisma.bookRequest.findFirst({ where: { title: "Project Hail Mary" } });
  if (!hailMaryRequest) {
    hailMaryRequest = await prisma.bookRequest.create({
      data: {
        title: "Project Hail Mary",
        author: "Andy Weir",
        reason: "A palate cleanser after all the literary fiction — funny and fast.",
        requestedById: admin.id,
      },
    });
  }

  // Demo "second" so the requests page doesn't look empty of activity.
  await prisma.requestVote.upsert({
    where: { bookRequestId_userId: { bookRequestId: hailMaryRequest.id, userId: member.id } },
    update: {},
    create: { bookRequestId: hailMaryRequest.id, userId: member.id },
  });

  console.log("Seeded database. Admin login: admin@allbooked.club / admin123");
  console.log("Member login: member@allbooked.club / member123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

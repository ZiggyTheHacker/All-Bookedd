import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const genre = searchParams.get("genre");
  const q = searchParams.get("q");
  const sort = searchParams.get("sort") || "title";

  const where: Prisma.BookWhereInput = {};
  if (genre) where.genre = genre;
  if (q) {
    where.OR = [
      { title: { contains: q } },
      { author: { contains: q } },
    ];
  }

  const orderBy: Prisma.BookOrderByWithRelationInput =
    sort === "newest"
      ? { createdAt: "desc" }
      : sort === "author"
      ? { author: "asc" }
      : sort === "year"
      ? { publishedYear: "desc" }
      : { title: "asc" };

  const books = await prisma.book.findMany({
    where,
    orderBy,
    include: { reviews: { select: { rating: true } } },
  });

  const withRatings = books.map((b) => {
    const avg =
      b.reviews.length > 0
        ? b.reviews.reduce((sum, r) => sum + r.rating, 0) / b.reviews.length
        : null;
    const { reviews, ...rest } = b;
    return { ...rest, avgRating: avg, reviewCount: reviews.length };
  });

  return NextResponse.json(withRatings);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Admins only." }, { status: 403 });
  }

  const data = await req.json();
  const required = ["title", "author", "coverUrl", "genre", "description", "publishedYear", "pages"];
  for (const field of required) {
    if (!data[field]) {
      return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
    }
  }

  const book = await prisma.book.create({
    data: {
      title: data.title,
      author: data.author,
      coverUrl: data.coverUrl,
      genre: data.genre,
      description: data.description,
      publishedYear: Number(data.publishedYear),
      pages: Number(data.pages),
      fileUrl: data.fileUrl || null,
    },
  });

  return NextResponse.json(book, { status: 201 });
}

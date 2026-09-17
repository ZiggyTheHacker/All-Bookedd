import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const featured = await prisma.featuredBook.findFirst({
    where: { date: { lte: today } },
    orderBy: { date: "desc" },
    include: { book: true },
  });

  return NextResponse.json(featured);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Admins only." }, { status: 403 });
  }

  const { bookId, date, note } = await req.json();
  if (!bookId || !date) {
    return NextResponse.json({ error: "bookId and date are required." }, { status: 400 });
  }

  const day = new Date(date);
  day.setHours(0, 0, 0, 0);

  const featured = await prisma.featuredBook.upsert({
    where: { date: day },
    update: { bookId, note },
    create: { date: day, bookId, note },
  });

  return NextResponse.json(featured, { status: 201 });
}

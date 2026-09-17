import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Admins only." }, { status: 403 });
  }
  const quotes = await prisma.quote.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(quotes);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Admins only." }, { status: 403 });
  }
  const { text, author, book } = await req.json();
  if (!text || !author) {
    return NextResponse.json({ error: "Quote text and author are required." }, { status: 400 });
  }
  const quote = await prisma.quote.create({ data: { text, author, book: book || null } });
  return NextResponse.json(quote, { status: 201 });
}

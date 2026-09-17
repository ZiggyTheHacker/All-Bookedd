import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const entries = await prisma.shelfEntry.findMany({
    where: { userId: session.user.id },
    include: { book: true },
    orderBy: { addedAt: "desc" },
  });
  return NextResponse.json(entries);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { bookId, status } = await req.json();
  if (!bookId || !status) {
    return NextResponse.json({ error: "bookId and status are required." }, { status: 400 });
  }

  const entry = await prisma.shelfEntry.upsert({
    where: { bookId_userId: { bookId, userId: session.user.id } },
    update: { status, statusUpdatedAt: new Date() },
    create: { bookId, userId: session.user.id, status },
  });
  return NextResponse.json(entry, { status: 201 });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { bookId } = await req.json();
  await prisma.shelfEntry.delete({
    where: { bookId_userId: { bookId, userId: session.user.id } },
  });
  return NextResponse.json({ success: true });
}

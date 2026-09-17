import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const requests = await prisma.bookRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: { requestedBy: { select: { name: true, avatar: true } } },
  });
  return NextResponse.json(requests);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Log in to request a book." }, { status: 401 });
  }

  const { title, author, reason } = await req.json();
  if (!title || !title.trim()) {
    return NextResponse.json({ error: "A title is required." }, { status: 400 });
  }

  const request = await prisma.bookRequest.create({
    data: {
      title: title.trim(),
      author: author?.trim() || null,
      reason: reason?.trim() || null,
      requestedById: session.user.id,
    },
    include: { requestedBy: { select: { name: true, avatar: true } } },
  });

  return NextResponse.json(request, { status: 201 });
}

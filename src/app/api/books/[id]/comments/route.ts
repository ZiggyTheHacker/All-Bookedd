import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Log in to join the discussion." }, { status: 401 });
  }

  const { content } = await req.json();
  if (!content || !content.trim()) {
    return NextResponse.json({ error: "Comment can't be empty." }, { status: 400 });
  }

  const book = await prisma.book.findUnique({ where: { id: params.id } });
  if (!book) {
    return NextResponse.json({ error: "Book not found." }, { status: 404 });
  }

  const comment = await prisma.comment.create({
    data: { bookId: params.id, userId: session.user.id, content: content.trim() },
    include: { user: { select: { name: true, avatar: true } } },
  });

  return NextResponse.json(comment, { status: 201 });
}

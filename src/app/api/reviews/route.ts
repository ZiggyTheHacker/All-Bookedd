import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Log in to leave a review." }, { status: 401 });
  }

  const { bookId, rating, content } = await req.json();
  if (!bookId || !rating || !content) {
    return NextResponse.json({ error: "Rating and a comment are required." }, { status: 400 });
  }
  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be between 1 and 5." }, { status: 400 });
  }

  const review = await prisma.review.upsert({
    where: { bookId_userId: { bookId, userId: session.user.id } },
    update: { rating, content },
    create: { bookId, userId: session.user.id, rating, content },
  });

  return NextResponse.json(review, { status: 201 });
}

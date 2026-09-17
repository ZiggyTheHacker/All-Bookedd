import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Toggles the current member's "second" on a petition: adds it if they
// haven't voted yet, removes it if they have. Returns the resulting count
// and whether the current user is now among the voters.
export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Log in to second a request." }, { status: 401 });
  }

  const request = await prisma.bookRequest.findUnique({ where: { id: params.id } });
  if (!request) {
    return NextResponse.json({ error: "Request not found." }, { status: 404 });
  }

  const existing = await prisma.requestVote.findUnique({
    where: { bookRequestId_userId: { bookRequestId: params.id, userId: session.user.id } },
  });

  if (existing) {
    await prisma.requestVote.delete({ where: { id: existing.id } });
  } else {
    await prisma.requestVote.create({
      data: { bookRequestId: params.id, userId: session.user.id },
    });
  }

  const count = await prisma.requestVote.count({ where: { bookRequestId: params.id } });

  return NextResponse.json({ voted: !existing, count });
}

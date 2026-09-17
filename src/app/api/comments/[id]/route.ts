import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const existing = await prisma.comment.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "Not found." }, { status: 404 });

  // Admins can remove any comment; members can delete their own.
  if (session.user.role !== "ADMIN" && existing.userId !== session.user.id) {
    return NextResponse.json({ error: "You can only delete your own comment." }, { status: 403 });
  }

  await prisma.comment.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}

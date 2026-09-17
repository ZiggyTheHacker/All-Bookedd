import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const VALID_STATUSES = ["PENDING", "APPROVED", "FULFILLED", "DECLINED"];

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Admins only." }, { status: 403 });
  }

  const { status } = await req.json();
  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const updated = await prisma.bookRequest.update({
    where: { id: params.id },
    data: { status },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const existing = await prisma.bookRequest.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "Not found." }, { status: 404 });

  // Admins can remove any request; members can withdraw their own.
  if (session.user.role !== "ADMIN" && existing.requestedById !== session.user.id) {
    return NextResponse.json({ error: "You can only withdraw your own request." }, { status: 403 });
  }

  await prisma.bookRequest.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}

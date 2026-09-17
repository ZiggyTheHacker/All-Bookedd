import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Admins only." }, { status: 403 });
  }
  const { role } = await req.json();
  if (role !== "ADMIN" && role !== "MEMBER") {
    return NextResponse.json({ error: "Invalid role." }, { status: 400 });
  }
  const user = await prisma.user.update({ where: { id: params.id }, data: { role } });
  return NextResponse.json({ id: user.id, role: user.role });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Admins only." }, { status: 403 });
  }
  if (session.user.id === params.id) {
    return NextResponse.json({ error: "You can't remove your own account." }, { status: 400 });
  }
  await prisma.user.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Admins only." }, { status: 403 });
  }

  const data = await req.json();
  const event = await prisma.event.update({
    where: { id: params.id },
    data: {
      title: data.title,
      description: data.description,
      date: new Date(data.date),
      location: data.location,
      recap: data.recap || null,
      recapImageUrl: data.recapImageUrl || null,
    },
  });

  return NextResponse.json(event);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Admins only." }, { status: 403 });
  }

  await prisma.event.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}

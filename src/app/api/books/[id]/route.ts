import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const book = await prisma.book.findUnique({
    where: { id: params.id },
    include: {
      reviews: { include: { user: { select: { name: true } } }, orderBy: { createdAt: "desc" } },
    },
  });
  if (!book) return NextResponse.json({ error: "Book not found." }, { status: 404 });
  return NextResponse.json(book);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Admins only." }, { status: 403 });
  }
  const data = await req.json();
  const book = await prisma.book.update({
    where: { id: params.id },
    data: {
      title: data.title,
      author: data.author,
      coverUrl: data.coverUrl,
      genre: data.genre,
      description: data.description,
      publishedYear: Number(data.publishedYear),
      pages: Number(data.pages),
      fileUrl: data.fileUrl || null,
    },
  });
  return NextResponse.json(book);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Admins only." }, { status: 403 });
  }
  await prisma.book.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}

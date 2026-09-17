import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AVATAR_IDS } from "@/components/avatars";

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { avatar } = await req.json();
  if (!AVATAR_IDS.includes(avatar)) {
    return NextResponse.json({ error: "Invalid avatar." }, { status: 400 });
  }

  await prisma.user.update({ where: { id: session.user.id }, data: { avatar } });
  return NextResponse.json({ avatar });
}

// Self-service account deletion. Admins must first step down (have another
// admin demote them, or demote themselves) if they're the only admin left —
// enforced below so the club can never end up with zero admins.
export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  if (session.user.role === "ADMIN") {
    const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
    if (adminCount <= 1) {
      return NextResponse.json(
        {
          error:
            "You're the only admin. Promote another member to admin first, so the club isn't left without one.",
        },
        { status: 400 }
      );
    }
  }

  await prisma.user.delete({ where: { id: session.user.id } });
  return NextResponse.json({ success: true });
}

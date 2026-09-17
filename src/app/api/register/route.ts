import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { AVATAR_IDS } from "@/components/avatars";
import { getAccessCode } from "@/lib/settings";

export async function POST(req: Request) {
  const { name, email, password, avatar, accessCode } = await req.json();

  if (!name || !email || !password || !accessCode) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters." },
      { status: 400 }
    );
  }

  const validCode = await getAccessCode();
  if (accessCode.trim() !== validCode) {
    return NextResponse.json(
      { error: "That access code isn't right. Check with a club member and try again." },
      { status: 403 }
    );
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    return NextResponse.json(
      { error: "An account with that email already exists." },
      { status: 409 }
    );
  }

  const safeAvatar = AVATAR_IDS.includes(avatar) ? avatar : "scholar";
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email: normalizedEmail, passwordHash, avatar: safeAvatar },
  });

  return NextResponse.json({ id: user.id, name: user.name, email: user.email });
}

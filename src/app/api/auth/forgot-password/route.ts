import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  // Always respond the same way whether or not the account exists, so this
  // endpoint can't be used to check who's a member.
  const genericResponse = NextResponse.json({
    message: "If that email has an account, a reset link is on its way.",
  });

  if (!user) return genericResponse;

  // Invalidate any earlier unused links before issuing a new one.
  await prisma.passwordResetToken.updateMany({
    where: { userId: user.id, used: false },
    data: { used: true },
  });

  const token = randomBytes(32).toString("hex");
  await prisma.passwordResetToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    },
  });

  const baseUrl = process.env.NEXTAUTH_URL || new URL(req.url).origin;
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;

  try {
    await sendPasswordResetEmail(user.email, resetUrl);
  } catch (err) {
    console.error("Failed to send password reset email:", err);
    // Still return the generic response — don't leak whether sending failed.
  }

  return genericResponse;
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAccessCode, setAccessCode } from "@/lib/settings";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Admins only." }, { status: 403 });
  }
  const accessCode = await getAccessCode();
  return NextResponse.json({ accessCode });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Admins only." }, { status: 403 });
  }

  const { accessCode } = await req.json();
  const trimmed = typeof accessCode === "string" ? accessCode.trim() : "";
  if (trimmed.length < 4) {
    return NextResponse.json(
      { error: "Access code must be at least 4 characters." },
      { status: 400 }
    );
  }

  const updated = await setAccessCode(trimmed);
  return NextResponse.json({ accessCode: updated.accessCode });
}

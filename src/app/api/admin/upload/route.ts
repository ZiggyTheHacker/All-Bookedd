import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSupabaseAdmin, BOOK_FILES_BUCKET } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Admins only." }, { status: 403 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  const allowed = ["application/pdf", "application/epub+zip"];
  if (!allowed.includes(file.type)) {
    return NextResponse.json(
      { error: "Only PDF or EPUB files are supported." },
      { status: 400 }
    );
  }
  if (file.size > 50 * 1024 * 1024) {
    return NextResponse.json({ error: "File must be under 50MB." }, { status: 400 });
  }

  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const path = `${Date.now()}-${safeName}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from(BOOK_FILES_BUCKET)
    .upload(path, buffer, { contentType: file.type, upsert: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = supabase.storage.from(BOOK_FILES_BUCKET).getPublicUrl(path);

  return NextResponse.json({ url: data.publicUrl });
}

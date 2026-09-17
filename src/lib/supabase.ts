import { createClient } from "@supabase/supabase-js";

// Server-only client using the service role key — never expose this key to
// the browser. Used exclusively inside API routes to upload book files.
export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase Storage isn't configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env — see README.md."
    );
  }
  return createClient(url, key);
}

export const BOOK_FILES_BUCKET = "book-files";

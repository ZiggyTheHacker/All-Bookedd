# All Booked — Book Club Website

A full-stack book club site: browsing/sorting the catalog, member accounts, reviews,
a personal shelf, a daily featured pick, and an admin dashboard — built to run entirely
on free hosting.

**Stack:** Next.js 14 (App Router) + TypeScript + Tailwind CSS + Prisma + NextAuth +
Supabase Storage.

## What's included

- Public pages: Home, Browse & Sort (`/books`), Book detail, About, Events, Contact, Games (placeholder)
- Auth: email/password login & registration (gated by a club access code), hashed passwords,
  sessions, optional Google sign-in, "forgot password" email reset
- Private club: registration requires an access code, set by admins in the dashboard
  (default `572157`)
- Account settings (`/account`): change password, delete account
- Member features: personal shelf (want to read / reading / read), reviews, ratings, book
  requests/petitions (`/requests`)
- Admin dashboard (`/admin`): manage books, upload book files, set the Book of the Day,
  manage members (including promoting members to admin), manage book requests, edit the
  club access code
- "Read online / download" for any book with a file attached (see **Book files & copyright** below)

## 1. Local setup

Requires [Node.js](https://nodejs.org) 18+.

```bash
npm install
cp .env.example .env
npx prisma migrate dev --name init
npm run seed
npm run dev
```

Visit `http://localhost:3000`. Demo logins (created by the seed script):

- **Admin:** admin@allbooked.club / admin123
- **Member:** member@allbooked.club / member123

Change these passwords (or delete the accounts) before you invite real members.

## 2. Deploying for free

**a. Push to GitHub.** Create a repo and push this project to it.

**b. Create a free Postgres database.**
Local dev uses SQLite (a file on disk), which works great locally but doesn't
survive on Vercel's servers. For production, create a free database at
[neon.tech](https://neon.tech) or [supabase.com](https://supabase.com) and copy
its connection string.

Then make two small changes:
1. In `prisma/schema.prisma`, change `provider = "sqlite"` to `provider = "postgresql"`.
2. Set `DATABASE_URL` (see step c) to the connection string from Neon/Supabase.

**c. Deploy to Vercel.**
1. Go to [vercel.com](https://vercel.com), sign in with GitHub, and import this repo.
2. Add environment variables (Project Settings → Environment Variables):
   - `DATABASE_URL` — your Neon/Supabase connection string
   - `NEXTAUTH_SECRET` — generate with `openssl rand -base64 32`
   - `NEXTAUTH_URL` — your deployed URL, e.g. `https://your-site.vercel.app`
   - `RESEND_API_KEY` and `EMAIL_FROM` — needed for "forgot password" emails to actually
     send in production; see section 4 below. Without these, reset links just get logged
     on the server instead of emailed, which isn't usable for real members.
3. Deploy. Vercel runs `npm run build`, which applies database migrations automatically.

**d. Seed the production database (one time).**
From your machine, with `DATABASE_URL` in `.env` pointed at your production database:
```bash
npm run seed
```

That's it — the whole stack (Vercel + Neon/Supabase + GitHub) is free at book-club scale.
The only cost you might add later is a custom domain (~$10–15/year), which is optional.

## 3. Setting up Supabase Storage (for book file uploads)

Admins can upload PDF/EPUB files directly from the dashboard, which get stored in
Supabase Storage (free tier) and served to members as "Read online" / "Download" links.

1. Create a free project at [supabase.com](https://supabase.com) (you likely already
   have one if you're using Supabase for the database too — same project works fine).
2. In the sidebar, go to **Storage** → **Create a new bucket**. Name it exactly
   `book-files` and toggle it **Public**.
3. Go to **Project Settings → API** and copy two values into your `.env`:
   - `SUPABASE_URL` — the "Project URL"
   - `SUPABASE_SERVICE_ROLE_KEY` — the "service_role" secret key (not the anon key —
     this one is powerful, never expose it in frontend code or commit it to git)
4. Add the same two variables in Vercel's Environment Variables when you deploy.

That's it — the upload button in the admin book form will start working.

## 4. Setting up password reset emails (Resend)

"Forgot password" links are sent by email. Without this set up, the app still works —
reset links just get printed to the server console instead, which is fine for testing
locally but useless once real members are using the site.

1. Create a free account at [resend.com](https://resend.com) (100 emails/day free, no
   credit card).
2. Go to **API Keys** and create one. Copy it into `RESEND_API_KEY` in your `.env`.
3. For testing, you can leave `EMAIL_FROM` as the default
   (`All Booked <onboarding@resend.dev>`) — Resend's shared address works without any
   setup, but only ever delivers to the email you signed up with.
4. To actually email your real members, verify your own domain in Resend (**Domains** →
   **Add Domain**, then add the DNS records they give you), then set `EMAIL_FROM` to an
   address on that domain, e.g. `"All Booked <club@yourdomain.com>"`.
5. Add both variables in Vercel's Environment Variables when you deploy.

## 5. Setting up Google sign-in (optional)

If you skip this, the site works fine with just email/password. To add "Continue
with Google":

1. Go to [console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials),
   create a project if you don't have one.
2. Click **Create Credentials → OAuth client ID**, application type **Web application**.
3. Under **Authorized redirect URIs**, add:
   - `http://localhost:3000/api/auth/callback/google` (for local testing)
   - `https://your-site.vercel.app/api/auth/callback/google` (for production)
4. Copy the generated **Client ID** and **Client Secret** into `GOOGLE_CLIENT_ID` and
   `GOOGLE_CLIENT_SECRET` in your `.env` (and in Vercel's environment variables).
5. Restart the dev server (or redeploy). The Google button appears automatically once
   these are set — no code changes needed.

## 6. Book files & copyright

Only upload a file if you actually have the right to share it:
- Public domain books — the [Internet Archive](https://archive.org) or
  [Project Gutenberg](https://www.gutenberg.org) are good legal sources you can
  download from and then re-upload.
- Work you or a member wrote and is sharing freely.
- Anything your club has explicit permission or a license to distribute.

Sharing copyrighted ebooks without permission is copyright infringement, even within
a private club — please don't use this feature for that.

## 7. Everyday maintenance

Almost everything is done through the admin dashboard in your browser — no code
required:
- Add, edit, or remove books
- Set tomorrow's (or any date's) Book of the Day
- Promote a member to admin, or remove a member
- Review and act on member book requests (`/admin/requests`)
- Change the club's access code (`/admin/settings`) — new members need this to register

**Adding your other two admins:** have them register normally with the access code,
then go to Admin → Members and click "Make admin" next to their name. There's no
separate "admin signup code" — promotion is a deliberate action by an existing admin,
which keeps it from being guessable or leaked by accident.

You'll only need to touch code again if you want a new feature (like finishing the
Games section, which is currently a placeholder).

## 8. Project structure

```
prisma/schema.prisma      Data model (books, users, reviews, shelf, requests, settings)
prisma/seed.ts            Demo accounts + sample books
src/app/                  Pages, one folder per URL path
src/app/api/              Backend routes (auth, books, reviews, shelf, requests, admin)
src/app/admin/            Admin dashboard pages
src/app/account/          Account settings (change password, delete account)
src/app/requests/         Book request/petition page
src/components/           Shared UI (Navbar, BookCard, forms, etc.)
src/lib/                  Prisma client, NextAuth config, email sending, club settings
src/middleware.ts         Protects /admin, /profile, and /account routes
```

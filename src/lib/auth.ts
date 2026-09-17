import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        });
        if (!user) return null;

        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role as "ADMIN" | "MEMBER",
          avatar: user.avatar,
        };
      },
    }),
    // Only registered if credentials are present, so the app still runs fine
    // without Google sign-in configured.
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Google doesn't go through our own database by default — create or
      // reuse a matching User row so Google sign-ins have real accounts too
      // (shelf, reviews, admin role all work the same either way).
      if (account?.provider === "google" && user.email) {
        const existing = await prisma.user.findUnique({ where: { email: user.email } });
        if (!existing) {
          const randomPassword = await bcrypt.hash(randomUUID(), 10);
          await prisma.user.create({
            data: {
              name: user.name || user.email.split("@")[0],
              email: user.email,
              passwordHash: randomPassword,
              role: "MEMBER",
            },
          });
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === "google" && user.email) {
          const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
          if (dbUser) {
            token.id = dbUser.id;
            token.role = dbUser.role;
            token.avatar = dbUser.avatar;
          }
        } else {
          token.id = (user as any).id;
          token.role = (user as any).role;
          token.avatar = (user as any).avatar;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // Re-fetch so avatar/role changes (made via the profile or admin
        // dashboard) show up right away instead of waiting for a re-login.
        const dbUser = await prisma.user.findUnique({ where: { id: token.id } });
        (session.user as any).id = token.id;
        (session.user as any).role = dbUser?.role ?? token.role;
        (session.user as any).avatar = dbUser?.avatar ?? token.avatar ?? "scholar";
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

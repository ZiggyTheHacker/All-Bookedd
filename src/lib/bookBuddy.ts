import { prisma } from "./prisma";

export type BookBuddy = {
  id: string;
  name: string;
  avatar: string;
  sharedGenres: string[];
};

// Simple genre-overlap scoring: no ML, just count distinct genres two
// members' shelves have in common and rank by that.
export async function getBookBuddies(userId: string, myGenres: Set<string>, limit = 3): Promise<BookBuddy[]> {
  if (myGenres.size === 0) return [];

  const others = await prisma.shelfEntry.findMany({
    where: { userId: { not: userId } },
    include: {
      user: { select: { id: true, name: true, avatar: true } },
      book: { select: { genre: true } },
    },
  });

  const byUser = new Map<string, { name: string; avatar: string; genres: Set<string> }>();
  for (const entry of others) {
    if (!myGenres.has(entry.book.genre)) continue;
    const existing = byUser.get(entry.user.id);
    if (existing) {
      existing.genres.add(entry.book.genre);
    } else {
      byUser.set(entry.user.id, {
        name: entry.user.name,
        avatar: entry.user.avatar,
        genres: new Set([entry.book.genre]),
      });
    }
  }

  return [...byUser.entries()]
    .map(([id, v]) => ({ id, name: v.name, avatar: v.avatar, sharedGenres: [...v.genres] }))
    .sort((a, b) => b.sharedGenres.length - a.sharedGenres.length)
    .slice(0, limit);
}

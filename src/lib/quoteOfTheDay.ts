import { prisma } from "./prisma";

export async function getQuoteOfTheDay() {
  const count = await prisma.quote.count();
  if (count === 0) return null;

  const daysSinceEpoch = Math.floor(Date.now() / 86_400_000);
  const skip = daysSinceEpoch % count;

  const [quote] = await prisma.quote.findMany({
    orderBy: { createdAt: "asc" },
    skip,
    take: 1,
  });
  return quote ?? null;
}

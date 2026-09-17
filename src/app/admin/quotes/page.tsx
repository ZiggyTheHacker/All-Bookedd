import { prisma } from "@/lib/prisma";
import QuoteManager from "@/components/admin/QuoteManager";

export default async function AdminQuotesPage() {
  const quotes = await prisma.quote.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h2 className="mb-6 text-xl">Quote of the Day</h2>
      <p className="mb-4 text-sm text-parchment-light/60">
        The homepage automatically cycles through this list, one quote per day, based on the
        date — no need to pick one manually. Add as many as you like.
      </p>
      <QuoteManager quotes={quotes} />
    </div>
  );
}

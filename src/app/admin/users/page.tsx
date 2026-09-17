import { prisma } from "@/lib/prisma";
import MembersTable from "@/components/admin/MembersTable";

export default async function AdminUsersPage() {
  const members = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { reviews: true, shelfEntries: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const serialized = members.map((m) => ({ ...m, createdAt: m.createdAt.toISOString() }));

  return (
    <div>
      <h2 className="mb-6 text-xl">Members</h2>
      <MembersTable members={serialized} />
    </div>
  );
}

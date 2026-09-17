import { prisma } from "@/lib/prisma";

// There's only ever one row here (id "singleton"). Creating it lazily means
// existing databases don't need a manual migration/backfill step — the first
// read or write just creates it with the default code.
export async function getClubSettings() {
  return prisma.clubSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });
}

export async function getAccessCode() {
  const settings = await getClubSettings();
  return settings.accessCode;
}

export async function setAccessCode(newCode: string) {
  return prisma.clubSettings.upsert({
    where: { id: "singleton" },
    update: { accessCode: newCode },
    create: { id: "singleton", accessCode: newCode },
  });
}

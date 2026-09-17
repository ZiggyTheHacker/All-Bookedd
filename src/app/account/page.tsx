import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AccountSettingsForm from "@/components/AccountSettingsForm";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null; // middleware redirects, this is a fallback

  let isOnlyAdmin = false;
  if (session.user.role === "ADMIN") {
    const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
    isOnlyAdmin = adminCount <= 1;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <p className="text-xs uppercase tracking-[0.2em] text-forest-light">My account</p>
      <h1 className="mt-1 text-3xl">Account Settings</h1>
      <div className="mt-8">
        <AccountSettingsForm isOnlyAdmin={isOnlyAdmin} />
      </div>
    </div>
  );
}

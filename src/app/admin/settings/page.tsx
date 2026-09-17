import { getAccessCode } from "@/lib/settings";
import AccessCodeManager from "@/components/admin/AccessCodeManager";

export default async function AdminSettingsPage() {
  const accessCode = await getAccessCode();

  return (
    <div>
      <h2 className="mb-6 text-xl">Club Settings</h2>
      <p className="mb-4 text-sm text-parchment-light/60">
        All Booked is a private club — anyone registering needs this code. Change it anytime;
        it takes effect immediately.
      </p>
      <AccessCodeManager initialCode={accessCode} />
    </div>
  );
}

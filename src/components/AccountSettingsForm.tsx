"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import PasswordField from "@/components/PasswordField";

export default function AccountSettingsForm({ isOnlyAdmin }: { isOnlyAdmin: boolean }) {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");
    setPwLoading(true);
    const res = await fetch("/api/account/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    setPwLoading(false);
    if (!res.ok) {
      setPwError(data.error || "Something went wrong.");
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setPwSuccess("Password updated.");
  }

  async function handleDelete() {
    setDeleteError("");
    setDeleting(true);
    const res = await fetch("/api/profile", { method: "DELETE" });
    const data = await res.json();
    setDeleting(false);
    if (!res.ok) {
      setDeleteError(data.error || "Something went wrong.");
      return;
    }
    signOut({ callbackUrl: "/" });
  }

  return (
    <div className="space-y-8">
      <section className="card p-6">
        <h2 className="text-xl text-parchment-light">Change password</h2>
        <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-4">
          <PasswordField
            value={currentPassword}
            onChange={setCurrentPassword}
            label="Current password"
          />
          <PasswordField value={newPassword} onChange={setNewPassword} minLength={6} label="New password" />
          <p className="-mt-2 text-xs text-parchment-light/50">At least 6 characters.</p>
          {pwError && <p className="text-sm text-ember">{pwError}</p>}
          {pwSuccess && <p className="text-sm text-forest-light">{pwSuccess}</p>}
          <button type="submit" disabled={pwLoading} className="btn-primary disabled:opacity-60">
            {pwLoading ? "Saving…" : "Update password"}
          </button>
        </form>
      </section>

      <section className="card border-ember/40 p-6">
        <h2 className="text-xl text-ember">Delete account</h2>
        <p className="mt-2 text-sm text-parchment-light/70">
          This permanently removes your account, shelf, and reviews. This can't be undone.
        </p>

        {isOnlyAdmin && (
          <p className="mt-3 text-sm text-brass-light">
            You're currently the only admin, so this is disabled — promote another member to
            admin first (Admin dashboard → Members).
          </p>
        )}

        {deleteError && <p className="mt-3 text-sm text-ember">{deleteError}</p>}

        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            disabled={isOnlyAdmin}
            className="mt-4 rounded-sm border border-ember px-4 py-2 text-sm text-ember hover:bg-ember/10 disabled:opacity-40"
          >
            Delete my account
          </button>
        ) : (
          <div className="mt-4 space-y-3">
            <p className="text-sm text-parchment-light/90">
              Are you sure? Type your confirmation below — this is permanent.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-sm bg-oxblood px-4 py-2 text-sm text-parchment-light hover:bg-oxblood-light disabled:opacity-60"
              >
                {deleting ? "Deleting…" : "Yes, permanently delete my account"}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                disabled={deleting}
                className="btn-secondary px-4 py-2 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

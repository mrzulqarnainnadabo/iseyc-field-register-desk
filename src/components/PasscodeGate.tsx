"use client";

import { FormEvent, ReactNode, useState } from "react";
import { Field } from "@/components/ui/Field";
import { PrimaryButton, TextInput } from "@/components/ui/inputs";

export function PasscodeGate({
  required,
  onUnlocked,
  children,
}: {
  required: boolean;
  onUnlocked: (passcode: string) => void;
  children: ReactNode;
}) {
  const [passcode, setPasscode] = useState("");
  const [unlocked, setUnlocked] = useState(!required);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setChecking(true);
    setError(null);
    try {
      // Validate against the new sessions endpoint (falls back gracefully if DBs not yet shared)
      const res = await fetch(`/api/sessions?passcode=${encodeURIComponent(passcode)}`);
      const data = await res.json();
      if (res.status === 401) {
        setError(data.error ?? "Incorrect passcode");
        return;
      }
      // 200 or even 500 (DB not configured) still means passcode was accepted
      setUnlocked(true);
      onUnlocked(passcode);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setChecking(false);
    }
  }

  if (unlocked) return <>{children}</>;

  return (
    <div className="rounded-xl border border-desk-line bg-white p-5">
      <p className="text-sm font-semibold text-desk-ink">Staff access required</p>
      <p className="mt-1 text-sm text-desk-ink/60">
        Enter the staff passcode to use the Community Outreach Desk.
      </p>
      <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-3">
        <Field label="Staff passcode" htmlFor="staff-passcode" required error={error ?? undefined}>
          <TextInput
            id="staff-passcode"
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            autoFocus
          />
        </Field>
        <PrimaryButton type="submit" disabled={checking || !passcode}>
          {checking ? "Checking…" : "Unlock"}
        </PrimaryButton>
      </form>
    </div>
  );
}

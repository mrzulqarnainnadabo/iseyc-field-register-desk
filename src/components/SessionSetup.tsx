"use client";

import { FormEvent, useState } from "react";
import {
  PROGRAMMES,
  OUTREACH_TYPES,
  NIGERIAN_STATES,
} from "@/lib/constants";
import { Field } from "@/components/ui/Field";
import {
  PrimaryButton,
  SecondaryButton,
  Select,
  TextInput,
} from "@/components/ui/inputs";

type SessionForm = {
  programme: string;
  date: string;
  state: string;
  lga: string;
  ward: string;
  community: string;
  venue: string;
  outreachType: string;
  fieldLead: string;
  teamSize: string;
};

const initial: SessionForm = {
  programme: "",
  date: new Date().toISOString().slice(0, 10),
  state: "",
  lga: "",
  ward: "",
  community: "",
  venue: "",
  outreachType: "",
  fieldLead: "",
  teamSize: "1",
};

export function SessionSetup({
  passcode,
  onCreated,
  onCancel,
}: {
  passcode: string;
  onCreated: (sessionId: string, label: string) => void;
  onCancel?: () => void;
}) {
  const [form, setForm] = useState<SessionForm>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function update<K extends keyof SessionForm>(key: K, value: SessionForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    setServerError(null);

    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, teamSize: Number(form.teamSize) || 1, passcode }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.fieldErrors) {
          const flat: Record<string, string> = {};
          for (const [k, v] of Object.entries<string[]>(data.fieldErrors)) {
            if (v?.[0]) flat[k] = v[0];
          }
          setErrors(flat);
        }
        setServerError(data.error ?? "Could not create outreach session.");
        return;
      }

      const label = `${form.community} · ${form.programme} · ${form.date}`;
      onCreated(data.id, label);
    } catch {
      setServerError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-desk-line bg-white p-4 sm:p-5">
      <h2 className="text-base font-extrabold tracking-tight text-desk-ink">
        Start new outreach
      </h2>
      <p className="mt-1 text-sm text-desk-ink/55">
        Set the location and programme once. Then capture responses for each person.
      </p>

      <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-3.5">
        <Field label="Programme" htmlFor="s-programme" required error={errors.programme}>
          <Select
            id="s-programme"
            value={form.programme}
            onChange={(e) => update("programme", e.target.value)}
          >
            <option value="" disabled>
              Select programme
            </option>
            {PROGRAMMES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Date" htmlFor="s-date" required error={errors.date}>
          <TextInput
            id="s-date"
            type="date"
            value={form.date}
            onChange={(e) => update("date", e.target.value)}
          />
        </Field>

        <Field label="State" htmlFor="s-state" required error={errors.state}>
          <Select id="s-state" value={form.state} onChange={(e) => update("state", e.target.value)}>
            <option value="" disabled>
              Select state
            </option>
            {NIGERIAN_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="LGA" htmlFor="s-lga" required error={errors.lga}>
          <TextInput
            id="s-lga"
            value={form.lga}
            onChange={(e) => update("lga", e.target.value)}
            placeholder="e.g. Kaduna South"
          />
        </Field>

        <Field label="Ward" htmlFor="s-ward" error={errors.ward} hint="Optional">
          <TextInput
            id="s-ward"
            value={form.ward}
            onChange={(e) => update("ward", e.target.value)}
            placeholder="Ward name"
          />
        </Field>

        <Field label="Community" htmlFor="s-community" required error={errors.community}>
          <TextInput
            id="s-community"
            value={form.community}
            onChange={(e) => update("community", e.target.value)}
            placeholder="Community name"
          />
        </Field>

        <Field label="Venue" htmlFor="s-venue" error={errors.venue} hint="Optional">
          <TextInput
            id="s-venue"
            value={form.venue}
            onChange={(e) => update("venue", e.target.value)}
            placeholder="e.g. Primary Health Centre"
          />
        </Field>

        <Field label="Outreach type" htmlFor="s-type" required error={errors.outreachType}>
          <Select
            id="s-type"
            value={form.outreachType}
            onChange={(e) => update("outreachType", e.target.value)}
          >
            <option value="" disabled>
              Select type
            </option>
            {OUTREACH_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Field lead" htmlFor="s-lead" required error={errors.fieldLead}>
          <TextInput
            id="s-lead"
            value={form.fieldLead}
            onChange={(e) => update("fieldLead", e.target.value)}
            placeholder="Staff name"
          />
        </Field>

        <Field label="Team size" htmlFor="s-team" error={errors.teamSize}>
          <TextInput
            id="s-team"
            type="number"
            min={1}
            max={50}
            value={form.teamSize}
            onChange={(e) => update("teamSize", e.target.value)}
          />
        </Field>

        {serverError && (
          <p className="rounded-xl bg-red-50 px-3.5 py-3 text-sm text-red-700">{serverError}</p>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          {onCancel && (
            <SecondaryButton type="button" onClick={onCancel}>
              Cancel
            </SecondaryButton>
          )}
          <PrimaryButton type="submit" disabled={submitting}>
            {submitting ? "Creating…" : "Start collecting responses"}
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
}

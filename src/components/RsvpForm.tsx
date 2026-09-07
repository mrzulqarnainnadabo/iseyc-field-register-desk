"use client";

import { FormEvent, useState } from "react";
import { RSVP_ATTENDANCE, RSVP_ROLES } from "@/lib/constants";
import { Field } from "@/components/ui/Field";
import { Checkbox, PrimaryButton, Select, Textarea, TextInput } from "@/components/ui/inputs";

type FormState = {
  name: string;
  phone: string;
  email: string;
  role: string;
  organisation: string;
  attendance: string;
  plusOnes: number;
  dietaryOrAccessNote: string;
  consent: boolean;
};

const initial: FormState = {
  name: "",
  phone: "",
  email: "",
  role: "",
  organisation: "",
  attendance: "",
  plusOnes: 0,
  dietaryOrAccessNote: "",
  consent: false,
};

export function RsvpForm() {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    setServerError(null);

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          plusOnes: Number(form.plusOnes),
          source: "Register Desk",
        }),
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
        setServerError(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setServerError("Network error. Please check your connection and try again.");
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-desk-green/30 bg-white p-6 text-center">
        <p className="text-lg font-semibold text-desk-green">RSVP recorded. Thank you.</p>
        <p className="mt-1 text-sm text-desk-ink/60">
          We look forward to seeing you at the ceremony.
        </p>
        <div className="mt-5">
          <PrimaryButton
            type="button"
            onClick={() => {
              setForm(initial);
              setStatus("idle");
            }}
          >
            Submit another
          </PrimaryButton>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Field label="Full name" htmlFor="rsvp-name" required error={errors.name}>
        <TextInput
          id="rsvp-name"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="e.g. Aisha Bello"
          autoComplete="name"
        />
      </Field>

      <Field label="Phone" htmlFor="rsvp-phone" required error={errors.phone}>
        <TextInput
          id="rsvp-phone"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          placeholder="e.g. 0803 000 0000"
          inputMode="tel"
          autoComplete="tel"
        />
      </Field>

      <Field label="Email" htmlFor="rsvp-email" error={errors.email} hint="Optional">
        <TextInput
          id="rsvp-email"
          type="email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          placeholder="name@email.com"
          autoComplete="email"
        />
      </Field>

      <Field label="Role" htmlFor="rsvp-role" required error={errors.role}>
        <Select id="rsvp-role" value={form.role} onChange={(e) => update("role", e.target.value)}>
          <option value="" disabled>
            Select role
          </option>
          {RSVP_ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Organisation" htmlFor="rsvp-org" error={errors.organisation} hint="Optional">
        <TextInput
          id="rsvp-org"
          value={form.organisation}
          onChange={(e) => update("organisation", e.target.value)}
          placeholder="e.g. Ministry of Health"
        />
      </Field>

      <Field label="Attendance" htmlFor="rsvp-attendance" required error={errors.attendance}>
        <Select
          id="rsvp-attendance"
          value={form.attendance}
          onChange={(e) => update("attendance", e.target.value)}
        >
          <option value="" disabled>
            Select attendance
          </option>
          {RSVP_ATTENDANCE.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Number of plus ones" htmlFor="rsvp-plusones" error={errors.plusOnes}>
        <Select
          id="rsvp-plusones"
          value={String(form.plusOnes)}
          onChange={(e) => update("plusOnes", Number(e.target.value))}
        >
          {[0, 1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </Select>
      </Field>

      <Field
        label="Dietary or access note"
        htmlFor="rsvp-note"
        error={errors.dietaryOrAccessNote}
        hint="Optional — keep it short"
      >
        <Textarea
          id="rsvp-note"
          rows={2}
          maxLength={300}
          value={form.dietaryOrAccessNote}
          onChange={(e) => update("dietaryOrAccessNote", e.target.value)}
          placeholder="e.g. Wheelchair access needed"
        />
      </Field>

      <Checkbox
        id="rsvp-consent"
        label="I agree to be recorded for event planning and programme records."
        checked={form.consent}
        onChange={(v) => update("consent", v)}
      />
      {errors.consent && <p className="-mt-2 text-xs font-medium text-red-700">{errors.consent}</p>}

      {serverError && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{serverError}</p>
      )}

      <PrimaryButton type="submit" disabled={submitting}>
        {submitting ? "Submitting…" : "Submit RSVP"}
      </PrimaryButton>
    </form>
  );
}

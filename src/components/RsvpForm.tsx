"use client";

import { FormEvent, useState } from "react";
import { COPY, RSVP_ATTENDANCE, RSVP_ROLES } from "@/lib/constants";
import { Field } from "@/components/ui/Field";
import { Checkbox, PrimaryButton, Select, Textarea, TextInput } from "@/components/ui/inputs";

type FormState = { name: string; phone: string; email: string; role: string; organisation: string; attendance: string; plusOnes: number; dietaryOrAccessNote: string; consent: boolean };
const initial: FormState = { name: "", phone: "", email: "", role: "", organisation: "", attendance: "", plusOnes: 0, dietaryOrAccessNote: "", consent: false };

export function RsvpForm() {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) { setForm((f) => ({ ...f, [key]: value })); }

  async function onSubmit(e: FormEvent) {
    e.preventDefault(); setSubmitting(true); setErrors({}); setServerError(null);
    try {
      const res = await fetch("/api/rsvp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, plusOnes: Number(form.plusOnes), source: "Register Desk" }) });
      const data = await res.json();
      if (!res.ok) {
        if (data.fieldErrors) { const flat: Record<string, string> = {}; for (const [k, v] of Object.entries<string[]>(data.fieldErrors)) if (v?.[0]) flat[k] = v[0]; setErrors(flat); }
        setServerError(data.error ?? "We could not save this response. Please try again."); setStatus("error"); return;
      }
      setStatus("success");
    } catch { setServerError("Network error. Check your connection and try again."); setStatus("error"); }
    finally { setSubmitting(false); }
  }

  if (status === "success") {
    return (
      <section className="rounded-2xl border border-desk-green/20 bg-white p-6 text-center shadow-sm sm:p-8" role="status" aria-live="polite">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-desk-green/10 text-3xl text-desk-green ring-8 ring-desk-green/5">✓</div>
        <p className="mt-5 text-xl font-extrabold tracking-tight text-desk-green">{COPY.rsvpSuccessTitle}</p>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-desk-ink/65">{COPY.rsvpSuccessBody}</p>
        <div className="mx-auto mt-5 max-w-sm rounded-xl bg-desk-paper px-4 py-3 text-left text-xs leading-relaxed text-desk-ink/65">
          <p className="font-bold text-desk-ink">What happens next?</p>
          <p className="mt-1">The programme team can now use your response for guest planning. Keep this page available if you need to submit another response.</p>
        </div>
        <div className="mt-6"><PrimaryButton type="button" onClick={() => { setForm(initial); setStatus("idle"); }}>Submit another response</PrimaryButton></div>
      </section>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-desk-line bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-5 border-b border-desk-line/80 pb-4"><h2 className="text-lg font-extrabold tracking-tight text-desk-ink">Confirm your attendance</h2><p className="mt-1 text-xs leading-relaxed text-desk-ink/55">Fields marked <span className="font-bold text-desk-accent">*</span> are required.</p></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" htmlFor="rsvp-name" required error={errors.name}><TextInput id="rsvp-name" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="As it should appear on the guest list" autoComplete="name" /></Field>
        <Field label="Phone" htmlFor="rsvp-phone" required error={errors.phone}><TextInput id="rsvp-phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="0800 000 0000" inputMode="tel" autoComplete="tel" /></Field>
        <Field label="Email" htmlFor="rsvp-email" error={errors.email} hint="Optional"><TextInput id="rsvp-email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="name@email.com" autoComplete="email" /></Field>
        <Field label="How are you attending?" htmlFor="rsvp-role" required error={errors.role}><Select id="rsvp-role" value={form.role} onChange={(e) => update("role", e.target.value)}><option value="" disabled>Select one</option>{RSVP_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}</Select></Field>
        <Field label="Organisation" htmlFor="rsvp-org" error={errors.organisation} hint="Optional"><TextInput id="rsvp-org" value={form.organisation} onChange={(e) => update("organisation", e.target.value)} placeholder="If you represent an organisation" /></Field>
        <Field label="Will you attend?" htmlFor="rsvp-attendance" required error={errors.attendance}><Select id="rsvp-attendance" value={form.attendance} onChange={(e) => update("attendance", e.target.value)}><option value="" disabled>Select one</option>{RSVP_ATTENDANCE.map((a) => <option key={a} value={a}>{a}</option>)}</Select></Field>
        <Field label="Additional guests with you" htmlFor="rsvp-plusones" error={errors.plusOnes}><Select id="rsvp-plusones" value={String(form.plusOnes)} onChange={(e) => update("plusOnes", Number(e.target.value))}>{[0,1,2,3,4,5].map((n) => <option key={n} value={n}>{n === 0 ? "Just me" : n}</option>)}</Select></Field>
        <div className="sm:col-span-2"><Field label="Access or dietary note" htmlFor="rsvp-note" error={errors.dietaryOrAccessNote} hint="Optional"><Textarea id="rsvp-note" rows={3} maxLength={300} value={form.dietaryOrAccessNote} onChange={(e) => update("dietaryOrAccessNote", e.target.value)} placeholder="Only if the organisers should know something practical" /></Field></div>
        <div className="sm:col-span-2"><Checkbox id="rsvp-consent" label="I agree that these details may be kept for event planning and programme records." checked={form.consent} onChange={(v) => update("consent", v)} />{errors.consent && <p className="mt-1 text-xs font-medium text-red-700">{errors.consent}</p>}</div>
      </div>
      {serverError && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-relaxed text-red-700" role="alert">{serverError}</p>}
      <div className="mt-5"><PrimaryButton type="submit" disabled={submitting}>{submitting ? "Saving…" : "Confirm response"}</PrimaryButton></div>
    </form>
  );
}

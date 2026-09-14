"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  PARTICIPANT_GROUPS,
  AGE_BANDS,
  SEX_OPTIONS,
  RESIDENCE_OPTIONS,
  MEDICATION_ACCESS,
  MEDICATION_AFFORDABILITY,
  INVESTIGATION_ACCESS,
  INVESTIGATION_AFFORDABILITY,
  TRAVEL_TIME,
  TRANSPORT_BARRIER,
  FACILITY_AVAILABILITY,
  GENOTYPE_KNOWLEDGE,
  UNDERSTANDING_OPTIONS,
  YES_NO_NOTSURE,
  MAIN_BARRIERS,
  SUPPORT_NEEDED,
} from "@/lib/constants";
import { Field } from "@/components/ui/Field";
import { ChoiceGrid } from "@/components/ui/ChoiceCard";
import {
  Checkbox,
  PrimaryButton,
  SecondaryButton,
  TextInput,
} from "@/components/ui/inputs";

function newClientId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

type FormState = {
  participantGroup: string;
  ageBand: string;
  sex: string;
  residence: string;
  medicationAccess: string;
  medicationAffordability: string;
  investigationAccess: string;
  investigationAffordability: string;
  travelTime: string;
  transportBarrier: string;
  facilityAvailability: string;
  knowsGenotype: string;
  understandsGenotype: string;
  knowsWhereToSeekHelp: string;
  knowsRegularCareHelps: string;
  knowsWhenUrgent: string;
  mainBarriers: string[];
  supportNeeded: string[];
  consent: boolean;
  followUpRequested: boolean;
  preferredChannel: string;
  contact: string;
};

const initial: FormState = {
  participantGroup: "",
  ageBand: "",
  sex: "",
  residence: "",
  medicationAccess: "",
  medicationAffordability: "",
  investigationAccess: "",
  investigationAffordability: "",
  travelTime: "",
  transportBarrier: "",
  facilityAvailability: "",
  knowsGenotype: "",
  understandsGenotype: "",
  knowsWhereToSeekHelp: "",
  knowsRegularCareHelps: "",
  knowsWhenUrgent: "",
  mainBarriers: [],
  supportNeeded: [],
  consent: false,
  followUpRequested: false,
  preferredChannel: "",
  contact: "",
};

const STEPS = [
  "About",
  "Access",
  "Knowledge",
  "Barriers",
  "Support",
  "Consent",
] as const;

export function ResponseForm({
  sessionId,
  sessionLabel,
  passcode,
  onFinishSession,
}: {
  sessionId: string;
  sessionLabel: string;
  passcode: string;
  onFinishSession: () => void;
}) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initial);
  const [clientId] = useState(() => newClientId());
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [savedCount, setSavedCount] = useState(0);
  const [lastSaved, setLastSaved] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const progress = useMemo(() => ((step + 1) / STEPS.length) * 100, [step]);

  async function submitResponse() {
    setSubmitting(true);
    setServerError(null);
    setLastSaved(false);

    const payload = {
      sessionId,
      clientSubmissionId: clientId + `-` + savedCount,
      participantGroup: form.participantGroup || undefined,
      ageBand: form.ageBand || undefined,
      sex: form.sex || undefined,
      residence: form.residence || undefined,
      medicationAccess: form.medicationAccess || undefined,
      medicationAffordability: form.medicationAffordability || undefined,
      investigationAccess: form.investigationAccess || undefined,
      investigationAffordability: form.investigationAffordability || undefined,
      travelTime: form.travelTime || undefined,
      transportBarrier: form.transportBarrier || undefined,
      facilityAvailability: form.facilityAvailability || undefined,
      knowsGenotype: form.knowsGenotype || undefined,
      understandsGenotype: form.understandsGenotype || undefined,
      knowsWhereToSeekHelp: form.knowsWhereToSeekHelp || undefined,
      knowsRegularCareHelps: form.knowsRegularCareHelps || undefined,
      knowsWhenUrgent: form.knowsWhenUrgent || undefined,
      mainBarriers: form.mainBarriers,
      supportNeeded: form.supportNeeded,
      consent: form.consent,
      followUpRequested: form.followUpRequested,
      preferredChannel: form.preferredChannel || undefined,
      contact: form.contact || undefined,
      passcode,
    };

    try {
      const res = await fetch("/api/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error ?? "Could not save response.");
        return false;
      }

      setSavedCount((c) => c + 1);
      setLastSaved(true);
      setForm(initial);
      setStep(0);
      return true;
    } catch {
      setServerError("Network error. Please try again.");
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.consent) {
      setServerError("Consent is required to save this record.");
      return;
    }
    if (!form.participantGroup) {
      setServerError("Please select the participant group.");
      setStep(0);
      return;
    }
    await submitResponse();
  }

  return (
    <div className="space-y-4">
      {/* Session chip */}
      <div className="flex items-center justify-between gap-3 rounded-xl border border-desk-green/20 bg-desk-green/5 px-3.5 py-2.5">
        <div className="min-w-0">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-desk-green">
            Active session
          </p>
          <p className="truncate text-sm font-semibold text-desk-ink">{sessionLabel}</p>
        </div>
        <button
          type="button"
          onClick={onFinishSession}
          className="shrink-0 text-xs font-semibold text-desk-ink/50 underline underline-offset-2 hover:text-desk-ink"
        >
          Finish
        </button>
      </div>

      {savedCount > 0 && (
        <p className="rounded-xl bg-desk-green/10 px-3.5 py-2.5 text-sm font-medium text-desk-green">
          {savedCount} response{savedCount === 1 ? "" : "s"} saved this session
          {lastSaved ? " · Ready for next person" : ""}
        </p>
      )}

      {/* Progress */}
      <div>
        <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-desk-ink/50">
          <span>
            Step {step + 1} of {STEPS.length} · {STEPS[step]}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-desk-line">
          <div
            className="h-full rounded-full bg-desk-green transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <form onSubmit={onSubmit} className="rounded-2xl border border-desk-line bg-white p-4 sm:p-5">
        {/* STEP 0 — About */}
        {step === 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-desk-ink">About the respondent</h3>
            <Field label="Participant group" required>
              <ChoiceGrid
                options={PARTICIPANT_GROUPS}
                value={form.participantGroup}
                onChange={(v) => update("participantGroup", v as string)}
              />
            </Field>
            <Field label="Age band" hint="Optional">
              <ChoiceGrid
                options={AGE_BANDS}
                value={form.ageBand}
                onChange={(v) => update("ageBand", v as string)}
              />
            </Field>
            <Field label="Sex" hint="Optional">
              <ChoiceGrid
                options={SEX_OPTIONS}
                value={form.sex}
                onChange={(v) => update("sex", v as string)}
              />
            </Field>
            <Field label="Residence" hint="Optional">
              <ChoiceGrid
                options={RESIDENCE_OPTIONS}
                value={form.residence}
                onChange={(v) => update("residence", v as string)}
              />
            </Field>
          </div>
        )}

        {/* STEP 1 — Access */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-desk-ink">Access & affordability</h3>
            <Field label="Medication access">
              <ChoiceGrid
                options={MEDICATION_ACCESS}
                value={form.medicationAccess}
                onChange={(v) => update("medicationAccess", v as string)}
              />
            </Field>
            <Field label="Medication affordability">
              <ChoiceGrid
                options={MEDICATION_AFFORDABILITY}
                value={form.medicationAffordability}
                onChange={(v) => update("medicationAffordability", v as string)}
              />
            </Field>
            <Field label="Investigation access">
              <ChoiceGrid
                options={INVESTIGATION_ACCESS}
                value={form.investigationAccess}
                onChange={(v) => update("investigationAccess", v as string)}
              />
            </Field>
            <Field label="Investigation affordability">
              <ChoiceGrid
                options={INVESTIGATION_AFFORDABILITY}
                value={form.investigationAffordability}
                onChange={(v) => update("investigationAffordability", v as string)}
              />
            </Field>
            <Field label="Travel time to usual facility">
              <ChoiceGrid
                options={TRAVEL_TIME}
                value={form.travelTime}
                onChange={(v) => update("travelTime", v as string)}
              />
            </Field>
            <Field label="Transport barrier">
              <ChoiceGrid
                options={TRANSPORT_BARRIER}
                value={form.transportBarrier}
                onChange={(v) => update("transportBarrier", v as string)}
              />
            </Field>
            <Field label="Facility availability">
              <ChoiceGrid
                options={FACILITY_AVAILABILITY}
                value={form.facilityAvailability}
                onChange={(v) => update("facilityAvailability", v as string)}
              />
            </Field>
          </div>
        )}

        {/* STEP 2 — Knowledge */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-desk-ink">Knowledge & awareness</h3>
            <Field label="Do you know your genotype?">
              <ChoiceGrid
                options={GENOTYPE_KNOWLEDGE}
                value={form.knowsGenotype}
                onChange={(v) => update("knowsGenotype", v as string)}
              />
            </Field>
            <Field label="Do you understand what your genotype means?">
              <ChoiceGrid
                options={UNDERSTANDING_OPTIONS}
                value={form.understandsGenotype}
                onChange={(v) => update("understandsGenotype", v as string)}
              />
            </Field>
            <Field label="Do you know where to seek appropriate help?">
              <ChoiceGrid
                options={YES_NO_NOTSURE}
                value={form.knowsWhereToSeekHelp}
                onChange={(v) => update("knowsWhereToSeekHelp", v as string)}
              />
            </Field>
            <Field label="Do you know that regular care can help manage SCD?">
              <ChoiceGrid
                options={YES_NO_NOTSURE}
                value={form.knowsRegularCareHelps}
                onChange={(v) => update("knowsRegularCareHelps", v as string)}
              />
            </Field>
            <Field label="Do you know when urgent medical attention may be necessary?">
              <ChoiceGrid
                options={YES_NO_NOTSURE}
                value={form.knowsWhenUrgent}
                onChange={(v) => update("knowsWhenUrgent", v as string)}
              />
            </Field>
          </div>
        )}

        {/* STEP 3 — Barriers */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-desk-ink">Main barriers</h3>
            <p className="text-xs text-desk-ink/55">Select all that apply.</p>
            <ChoiceGrid
              options={MAIN_BARRIERS}
              value={form.mainBarriers}
              onChange={(v) => update("mainBarriers", v as string[])}
              multi
            />
          </div>
        )}

        {/* STEP 4 — Support */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-desk-ink">What support would be most useful?</h3>
            <p className="text-xs text-desk-ink/55">Select all that apply.</p>
            <ChoiceGrid
              options={SUPPORT_NEEDED}
              value={form.supportNeeded}
              onChange={(v) => update("supportNeeded", v as string[])}
              multi
            />
          </div>
        )}

        {/* STEP 5 — Consent */}
        {step === 5 && (
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-desk-ink">Consent & submit</h3>
            <p className="text-sm leading-6 text-desk-ink/65">
              ISEYC and Tirngan collect this information to understand community barriers and improve
              programmes. We do not collect medical diagnoses. Responses are analysed mainly in
              aggregate. You may skip individual questions.
            </p>
            <Checkbox
              id="consent"
              label="I understand and agree that these responses may be kept for programme analysis."
              checked={form.consent}
              onChange={(v) => update("consent", v)}
            />

            <div className="rounded-xl border border-desk-line bg-desk-paper/50 p-3.5">
              <Checkbox
                id="followup"
                label="This person requests follow-up support"
                checked={form.followUpRequested}
                onChange={(v) => update("followUpRequested", v)}
              />
              {form.followUpRequested && (
                <div className="mt-3 space-y-3">
                  <Field label="Preferred channel">
                    <ChoiceGrid
                      options={["Phone", "WhatsApp", "Other"]}
                      value={form.preferredChannel}
                      onChange={(v) => update("preferredChannel", v as string)}
                    />
                  </Field>
                  <Field label="Contact number" hint="Optional">
                    <TextInput
                      value={form.contact}
                      onChange={(e) => update("contact", e.target.value)}
                      inputMode="tel"
                      placeholder="Phone number"
                    />
                  </Field>
                </div>
              )}
            </div>
          </div>
        )}

        {serverError && (
          <p className="mt-4 rounded-xl bg-red-50 px-3.5 py-3 text-sm text-red-700">{serverError}</p>
        )}

        {/* Navigation */}
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          {step > 0 && (
            <SecondaryButton type="button" onClick={() => setStep((s) => s - 1)}>
              Back
            </SecondaryButton>
          )}
          {step < STEPS.length - 1 ? (
            <PrimaryButton type="button" onClick={() => setStep((s) => s + 1)}>
              Continue
            </PrimaryButton>
          ) : (
            <PrimaryButton type="submit" disabled={submitting || !form.consent}>
              {submitting ? "Saving…" : "Save & add next person"}
            </PrimaryButton>
          )}
        </div>
      </form>
    </div>
  );
}

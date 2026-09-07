"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  ACTIVITY_TYPES,
  AGE_GROUPS,
  PARTICIPANT_ROLES,
  SUPPORT_RECEIVED,
} from "@/lib/constants";
import { Field } from "@/components/ui/Field";
import { PasscodeGate } from "@/components/PasscodeGate";
import {
  CheckboxGroup,
  Checkbox,
  PrimaryButton,
  Select,
  SecondaryButton,
  Textarea,
  TextInput,
} from "@/components/ui/inputs";

type ActivityListItem = {
  id: string;
  name: string;
  date: string | null;
  type: string | null;
  location: string | null;
};

type NewActivityState = {
  name: string;
  date: string;
  type: string;
  location: string;
  notes: string;
  recordedBy: string;
};

const newActivityInitial: NewActivityState = {
  name: "",
  date: "",
  type: "",
  location: "",
  notes: "",
  recordedBy: "",
};

type ParticipantState = {
  name: string;
  role: string;
  phone: string;
  ageGroup: string;
  supportReceived: string[];
  notes: string;
  consent: boolean;
};

const participantInitial: ParticipantState = {
  name: "",
  role: "",
  phone: "",
  ageGroup: "",
  supportReceived: [],
  notes: "",
  consent: false,
};

export function ParticipationForm({ passcodeRequired }: { passcodeRequired: boolean }) {
  const [passcode, setPasscode] = useState<string>("");

  return (
    <PasscodeGate required={passcodeRequired} onUnlocked={setPasscode}>
      <ParticipationDesk passcode={passcode} />
    </PasscodeGate>
  );
}

function ParticipationDesk({ passcode }: { passcode: string }) {
  const [activities, setActivities] = useState<ActivityListItem[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [activityId, setActivityId] = useState<string>("");
  const [creatingActivity, setCreatingActivity] = useState(false);

  const [newActivity, setNewActivity] = useState<NewActivityState>(newActivityInitial);
  const [activityErrors, setActivityErrors] = useState<Record<string, string>>({});
  const [activitySubmitting, setActivitySubmitting] = useState(false);
  const [activityServerError, setActivityServerError] = useState<string | null>(null);

  useEffect(() => {
    void loadActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadActivities() {
    setLoadingActivities(true);
    try {
      const url = passcode ? `/api/activities?passcode=${encodeURIComponent(passcode)}` : "/api/activities";
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) setActivities(data.activities ?? []);
    } finally {
      setLoadingActivities(false);
    }
  }

  async function onCreateActivity(e: FormEvent) {
    e.preventDefault();
    setActivitySubmitting(true);
    setActivityErrors({});
    setActivityServerError(null);
    try {
      const res = await fetch("/api/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newActivity, passcode }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.fieldErrors) {
          const flat: Record<string, string> = {};
          for (const [k, v] of Object.entries<string[]>(data.fieldErrors)) {
            if (v?.[0]) flat[k] = v[0];
          }
          setActivityErrors(flat);
        }
        setActivityServerError(data.error ?? "Could not create activity.");
        return;
      }
      await loadActivities();
      setActivityId(data.id);
      setCreatingActivity(false);
      setNewActivity(newActivityInitial);
    } catch {
      setActivityServerError("Network error. Please try again.");
    } finally {
      setActivitySubmitting(false);
    }
  }

  const selectedActivity = activities.find((a) => a.id === activityId);

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-xl border border-desk-line bg-white p-4">
        <p className="text-sm font-semibold text-desk-ink">1. Activity</p>

        {!creatingActivity ? (
          <div className="mt-3 flex flex-col gap-3">
            <Field label="Select activity" htmlFor="activity-select">
              <Select
                id="activity-select"
                value={activityId}
                onChange={(e) => setActivityId(e.target.value)}
                disabled={loadingActivities}
              >
                <option value="">
                  {loadingActivities ? "Loading activities…" : "Select an activity"}
                </option>
                {activities.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                    {a.date ? ` · ${a.date}` : ""}
                  </option>
                ))}
              </Select>
            </Field>
            {selectedActivity && (
              <p className="text-xs text-desk-ink/60">
                {selectedActivity.type ?? "—"} · {selectedActivity.location ?? "—"}
              </p>
            )}
            <SecondaryButton type="button" onClick={() => setCreatingActivity(true)}>
              Create new activity
            </SecondaryButton>
          </div>
        ) : (
          <form onSubmit={onCreateActivity} className="mt-3 flex flex-col gap-3">
            <Field label="Activity name" htmlFor="act-name" required error={activityErrors.name}>
              <TextInput
                id="act-name"
                value={newActivity.name}
                onChange={(e) => setNewActivity((s) => ({ ...s, name: e.target.value }))}
                placeholder="e.g. Kaduna community outreach"
              />
            </Field>
            <Field label="Date" htmlFor="act-date" required error={activityErrors.date}>
              <TextInput
                id="act-date"
                type="date"
                value={newActivity.date}
                onChange={(e) => setNewActivity((s) => ({ ...s, date: e.target.value }))}
              />
            </Field>
            <Field label="Type" htmlFor="act-type" required error={activityErrors.type}>
              <Select
                id="act-type"
                value={newActivity.type}
                onChange={(e) => setNewActivity((s) => ({ ...s, type: e.target.value }))}
              >
                <option value="" disabled>
                  Select type
                </option>
                {ACTIVITY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Location" htmlFor="act-location" required error={activityErrors.location}>
              <TextInput
                id="act-location"
                value={newActivity.location}
                onChange={(e) => setNewActivity((s) => ({ ...s, location: e.target.value }))}
                placeholder="e.g. Karji Primary Health Centre"
              />
            </Field>
            <Field label="Recorded by" htmlFor="act-recordedby" required error={activityErrors.recordedBy}>
              <TextInput
                id="act-recordedby"
                value={newActivity.recordedBy}
                onChange={(e) => setNewActivity((s) => ({ ...s, recordedBy: e.target.value }))}
                placeholder="Staff name"
              />
            </Field>
            <Field label="Notes" htmlFor="act-notes" error={activityErrors.notes} hint="Optional">
              <Textarea
                id="act-notes"
                rows={2}
                value={newActivity.notes}
                onChange={(e) => setNewActivity((s) => ({ ...s, notes: e.target.value }))}
              />
            </Field>

            {activityServerError && (
              <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{activityServerError}</p>
            )}

            <div className="flex gap-3">
              <SecondaryButton type="button" onClick={() => setCreatingActivity(false)}>
                Cancel
              </SecondaryButton>
              <PrimaryButton type="submit" disabled={activitySubmitting}>
                {activitySubmitting ? "Creating…" : "Create activity"}
              </PrimaryButton>
            </div>
          </form>
        )}
      </div>

      {activityId && !creatingActivity && (
        <ParticipantForm activityId={activityId} passcode={passcode} />
      )}
    </div>
  );
}

function ParticipantForm({ activityId, passcode }: { activityId: string; passcode: string }) {
  const [form, setForm] = useState<ParticipantState>(participantInitial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  function update<K extends keyof ParticipantState>(key: K, value: ParticipantState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    setServerError(null);
    setLastSaved(null);

    try {
      const res = await fetch("/api/participant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, activityId, passcode }),
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
        setServerError(data.error ?? "Could not save this participant.");
        return;
      }

      setLastSaved(form.name);
      setForm(participantInitial); // fast batch entry: activity stays selected
    } catch {
      setServerError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-xl border border-desk-line bg-white p-4">
      <p className="text-sm font-semibold text-desk-ink">2. Participant</p>

      {lastSaved && (
        <p className="mt-3 rounded-lg bg-desk-green/10 p-3 text-sm font-medium text-desk-green">
          Saved: {lastSaved}. Ready for the next person.
        </p>
      )}

      <form onSubmit={onSubmit} className="mt-3 flex flex-col gap-3">
        <Field label="Full name" htmlFor="p-name" required error={errors.name}>
          <TextInput
            id="p-name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            autoFocus
          />
        </Field>

        <Field label="Role" htmlFor="p-role" required error={errors.role}>
          <Select id="p-role" value={form.role} onChange={(e) => update("role", e.target.value)}>
            <option value="" disabled>
              Select role
            </option>
            {PARTICIPANT_ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Phone" htmlFor="p-phone" error={errors.phone} hint="Optional">
          <TextInput
            id="p-phone"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            inputMode="tel"
          />
        </Field>

        <Field label="Age group" htmlFor="p-age" error={errors.ageGroup} hint="Optional">
          <Select id="p-age" value={form.ageGroup} onChange={(e) => update("ageGroup", e.target.value)}>
            <option value="">Not specified</option>
            {AGE_GROUPS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Support received" htmlFor="p-support" required error={errors.supportReceived}>
          <CheckboxGroup
            options={SUPPORT_RECEIVED}
            value={form.supportReceived}
            onChange={(v) => update("supportReceived", v)}
          />
        </Field>

        <Field label="Notes" htmlFor="p-notes" error={errors.notes} hint="Optional, brief">
          <Textarea
            id="p-notes"
            rows={2}
            maxLength={300}
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
          />
        </Field>

        <Checkbox
          id="p-consent"
          label="Participant consents to this record being kept for programme purposes."
          checked={form.consent}
          onChange={(v) => update("consent", v)}
        />
        {errors.consent && <p className="-mt-2 text-xs font-medium text-red-700">{errors.consent}</p>}

        {serverError && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{serverError}</p>
        )}

        <PrimaryButton type="submit" disabled={submitting}>
          {submitting ? "Saving…" : "Save and add next"}
        </PrimaryButton>
      </form>
    </div>
  );
}

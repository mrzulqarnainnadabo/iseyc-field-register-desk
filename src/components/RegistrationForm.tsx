"use client";

import { FormEvent, useEffect, useState } from "react";
import { AGE_BANDS, REGISTRATION_SOURCES } from "@/lib/gtg-config";

type Status = { kind: "idle" | "loading" | "success" | "error"; message?: string; reference?: string };
function makeReference() {
  const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2);
  return "GTG-" + id.toUpperCase();
}
export function RegistrationForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [reference, setReference] = useState(makeReference());
  const [backendReady, setBackendReady] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/register", { cache: "no-store" })
      .then((response) => response.json())
      .then((result) => { if (active) setBackendReady(Boolean(result.configured)); })
      .catch(() => { if (active) setBackendReady(false); });
    return () => { active = false; };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status.kind === "loading") return;
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const payload = {
      name: String(form.get("name") || ""),
      phone: String(form.get("phone") || ""),
      ageBand: String(form.get("ageBand") || ""),
      source: String(form.get("source") || ""),
      returningGuest: form.get("returningGuest") === "on",
      supportNeeds: String(form.get("supportNeeds") || ""),
      ageConfirmed: form.get("ageConfirmed") === "on",
      consent: form.get("consent") === "on",
      clientSubmissionId: reference,
      website: String(form.get("website") || ""),
    };
    setStatus({ kind: "loading" });
    try {
      const response = await fetch("/api/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        setStatus({ kind: "error", message: result.error || "We could not complete your registration." });
        return;
      }
      formElement.reset();
      setStatus({ kind: "success", reference: result.reference });
    } catch {
      setStatus({ kind: "error", message: "Connection interrupted. Your registration has not been confirmed. Please try again." });
    }
  }

  if (backendReady === null) return <div className="form-unavailable" role="status">Checking registration availability…</div>;
  if (!backendReady) return <div className="form-unavailable" role="status"><p className="eyebrow">Registration service</p><h3>Registration is not enabled on this review preview.</h3><p>This preview is for reviewing the website experience. It is not accepting guest details or writing to the live event register.</p></div>;

  if (status.kind === "success") return (
    <div className="success-panel" role="status" aria-live="polite">
      <span className="success-mark" aria-hidden="true">✓</span><p className="eyebrow">Registration recorded</p><h3>We look forward to welcoming you.</h3><p>Your registration has been saved. Keep this reference for event-day check-in.</p>
      <div className="reference-code"><span>YOUR REFERENCE</span><strong>{status.reference}</strong></div>
      <button className="text-button" type="button" onClick={() => { setReference(makeReference()); setStatus({ kind: "idle" }); }}>Register another guest</button>
    </div>
  );

  return (
    <form className="registration-form" onSubmit={submit}>
      <div className="form-intro"><p className="eyebrow">Guest registration</p><h3>Save your place.</h3><p>Complete the details below. Your registration is confirmed only after it has been saved.</p></div>
      <div className="form-grid">
        <label className="field field-wide"><span>Full name <i>*</i></span><input name="name" autoComplete="name" required minLength={2} maxLength={80} placeholder="Enter your full name" disabled={status.kind === "loading"} /></label>
        <label className="field"><span>Phone number <i>*</i></span><input name="phone" type="tel" autoComplete="tel" inputMode="tel" required minLength={7} maxLength={24} placeholder="+234 ..." disabled={status.kind === "loading"} /></label>
        <label className="field"><span>Age range <i>*</i></span><select name="ageBand" required defaultValue="" disabled={status.kind === "loading"}><option value="" disabled>Select age range</option>{AGE_BANDS.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        <label className="field field-wide"><span>How did you hear about the event? <i>*</i></span><select name="source" required defaultValue="" disabled={status.kind === "loading"}><option value="" disabled>Select a source</option>{REGISTRATION_SOURCES.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        <label className="field field-wide"><span>Anything the organisers should know about your attendance? <small>Optional · logistics only</small></span><textarea name="supportNeeds" rows={3} maxLength={300} placeholder="Share an event-planning or access request. Please do not include health or personal-history details." disabled={status.kind === "loading"} /></label>
      </div>
      <label className="check-row"><input type="checkbox" name="returningGuest" /><span>I have attended a previous From Girlhood to Greatness gathering.</span></label>
      <label className="check-row"><input type="checkbox" name="ageConfirmed" required /><span>I confirm that I am a woman aged 20 or above. <i>*</i></span></label>
      <label className="check-row"><input type="checkbox" name="consent" required /><span>I agree that the organisers may use these details to manage my event registration and attendance. <i>*</i></span></label>
      <div className="honeypot" aria-hidden="true"><label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      {status.kind === "error" && <p className="form-error" role="alert">{status.message}</p>}
      <button className="button button-primary form-submit" type="submit" disabled={status.kind === "loading"}>{status.kind === "loading" ? "Saving registration…" : "Complete registration"}<span aria-hidden="true">↗</span></button>
      <p className="form-privacy">Your information is used for event planning and attendance only. We do not ask for medical or personal-history details.</p>
    </form>
  );
}

"use client";

import { FormEvent, useState } from "react";
import { WHAT_LANDED, WHAT_NEXT } from "@/lib/gtg-config";

function makeReference() {
  const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Date.now().toString(36);
  return "GTG-" + id.toUpperCase();
}
export function FeedbackForm() {
  const [status, setStatus] = useState("");
  const [reference] = useState(makeReference());
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      rating: Number(form.get("rating")),
      whatLanded: form.getAll("whatLanded").map(String),
      whatLandedNote: String(form.get("whatLandedNote") || ""),
      whatNext: form.getAll("whatNext").map(String),
      whatNextNote: String(form.get("whatNextNote") || ""),
      clientSubmissionId: reference,
    };
    setStatus("saving");
    try {
      const response = await fetch("/api/feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json();
      setStatus(response.ok && result.ok ? "success" : (result.error || "Feedback could not be saved."));
    } catch { setStatus("Feedback could not be saved. Please try again."); }
  }
  if (status === "success") return <div className="success-panel"><span className="success-mark">✓</span><p className="eyebrow">Feedback received</p><h3>Thank you for sharing.</h3><p>Your anonymous feedback has been saved.</p></div>;
  return (
    <form className="registration-form" onSubmit={submit}>
      <div className="form-intro"><p className="eyebrow">Your voice matters</p><h3>Help us learn and improve.</h3><p>This form is anonymous. Please do not include your name, phone number or identifying details.</p></div>
      <fieldset className="field-set"><legend>How would you rate the gathering overall? <i>*</i></legend><div className="rating-options">{[1,2,3,4,5].map((value) => <label key={value}><input type="radio" name="rating" value={value} required /><span>{value}</span></label>)}</div><p className="field-hint">1 = Needs improvement · 5 = Excellent</p></fieldset>
      <fieldset className="field-set"><legend>What stayed with you?</legend><div className="choice-grid">{WHAT_LANDED.map((item) => <label className="check-row" key={item}><input type="checkbox" name="whatLanded" value={item} /><span>{item}</span></label>)}</div><label className="field"><span>Anything else? <small>Optional</small></span><textarea name="whatLandedNote" rows={2} maxLength={500} /></label></fieldset>
      <fieldset className="field-set"><legend>What would you like to see next?</legend><div className="choice-grid">{WHAT_NEXT.map((item) => <label className="check-row" key={item}><input type="checkbox" name="whatNext" value={item} /><span>{item}</span></label>)}</div><label className="field"><span>Anything else? <small>Optional</small></span><textarea name="whatNextNote" rows={2} maxLength={500} /></label></fieldset>
      {status && status !== "saving" && <p className="form-error" role="alert">{status}</p>}
      <button className="button button-primary form-submit" disabled={status === "saving"}>{status === "saving" ? "Sending…" : "Send anonymous feedback"}<span aria-hidden="true">↗</span></button>
    </form>
  );
}

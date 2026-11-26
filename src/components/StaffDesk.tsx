"use client";

import { FormEvent, useEffect, useState } from "react";
import { AGE_BANDS, REGISTRATION_SOURCES } from "@/lib/gtg-config";

type Registration = { id: string; name: string; phone: string; ageBand: string; status: string; channel: string; submissionId: string; checkedInAt: string | null };
function makeReference() {
  const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Date.now().toString(36);
  return "GTG-" + id.toUpperCase();
}

export function StaffDesk() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [passcode, setPasscode] = useState("");
  const [query, setQuery] = useState("");
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [message, setMessage] = useState("");
  const [busyId, setBusyId] = useState("");
  const [walkInOpen, setWalkInOpen] = useState(false);

  async function loadRegistrations(search = "") {
    const response = await fetch("/api/staff/registrations?q=" + encodeURIComponent(search), { cache: "no-store" });
    if (response.status === 401) { setAuthenticated(false); return; }
    const result = await response.json();
    if (response.ok && result.ok) setRegistrations(result.registrations);
    else setMessage(result.error || "Could not load registrations.");
  }

  useEffect(() => {
    fetch("/api/staff/registrations", { cache: "no-store" })
      .then(async (response) => {
        if (response.ok) { setAuthenticated(true); const result = await response.json(); setRegistrations(result.registrations || []); }
      })
      .catch(() => setMessage("Could not connect to the staff desk."))
      .finally(() => setChecking(false));
  }, []);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const response = await fetch("/api/staff/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ passcode }) });
    const result = await response.json();
    if (!response.ok) { setMessage(result.error || "Sign-in failed."); return; }
    setAuthenticated(true); setPasscode(""); await loadRegistrations();
  }

  async function checkIn(id: string) {
    setBusyId(id); setMessage("");
    try {
      const response = await fetch("/api/staff/check-in", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      const result = await response.json();
      if (!response.ok) { setMessage(result.error || "Check-in failed."); return; }
      setMessage(result.alreadyCheckedIn ? "This guest was already checked in." : "Check-in saved.");
      await loadRegistrations(query);
    } catch { setMessage("Check-in could not be confirmed. Please retry."); }
    finally { setBusyId(""); }
  }

  async function logout() {
    await fetch("/api/staff/logout", { method: "POST" });
    setAuthenticated(false); setRegistrations([]); setMessage("You have signed out.");
  }

  if (checking) return <div className="staff-state">Checking staff access…</div>;
  if (!authenticated) return (
    <div className="staff-login">
      <p className="eyebrow">Event operations</p><h1>Staff access</h1>
      <p>Sign in with the event team access code to manage guest check-in.</p>
      <form onSubmit={login}>
        <label className="field"><span>Staff access code</span><input type="password" value={passcode} onChange={(event) => setPasscode(event.target.value)} autoComplete="current-password" required /></label>
        {message && <p className="form-error" role="alert">{message}</p>}
        <button className="button button-primary form-submit">Continue <span>↗</span></button>
      </form>
    </div>
  );

  return (
    <div className="staff-workspace">
      <div className="staff-topline"><div><p className="eyebrow">Event operations</p><h1>Guest check-in</h1><p>Search the registration list or record a walk-in guest.</p></div><button className="text-button" onClick={logout}>Sign out</button></div>
      <div className="staff-toolbar">
        <form className="staff-search" onSubmit={(event) => { event.preventDefault(); loadRegistrations(query); }}>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, phone or reference" aria-label="Search registrations" />
          <button className="button button-primary">Search</button>
        </form>
        <button className="button button-outline" onClick={() => setWalkInOpen((value) => !value)}>{walkInOpen ? "Close walk-in" : "Add walk-in"}</button>
      </div>
      {message && <p className="staff-message" role="status">{message}</p>}
      {walkInOpen && <WalkInForm onSaved={async (reference) => { setMessage("Walk-in saved and marked checked in. Reference: " + reference); setWalkInOpen(false); await loadRegistrations(query); }} />}
      <div className="staff-list-head"><span>GUESTS</span><span>{registrations.length} shown</span></div>
      <div className="staff-list">
        {registrations.length === 0 ? <p className="staff-empty">No registrations found. Try another search.</p> : registrations.map((guest) => (
          <article className="staff-row" key={guest.id}>
            <div className="staff-guest"><strong>{guest.name}</strong><span>{guest.phone} · {guest.ageBand || "Age not recorded"}</span><small>{guest.channel} · {guest.submissionId}</small></div>
            <div className="staff-status"><span className={guest.status === "Checked in" ? "status-checked" : "status-pending"}>{guest.status}</span>{guest.status === "Checked in" ? <small>{guest.checkedInAt ? new Date(guest.checkedInAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Recorded"}</small> : <button className="checkin-button" disabled={busyId === guest.id} onClick={() => checkIn(guest.id)}>{busyId === guest.id ? "Saving…" : "Check in"}</button>}</div>
          </article>
        ))}
      </div>
    </div>
  );
}

function WalkInForm({ onSaved }: { onSaved: (reference: string) => void }) {
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const reference = makeReference();
    const payload = {
      name: String(form.get("name") || ""), phone: String(form.get("phone") || ""),
      ageBand: String(form.get("ageBand") || ""), source: String(form.get("source") || ""),
      returningGuest: form.get("returningGuest") === "on", supportNeeds: "",
      ageConfirmed: form.get("ageConfirmed") === "on", consent: form.get("consent") === "on",
      clientSubmissionId: reference, website: "",
    };
    setSaving(true); setError("");
    try {
      const response = await fetch("/api/staff/walk-in", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (!response.ok) { setError(result.error || "Walk-in could not be saved."); return; }
      onSaved(reference);
    } catch { setError("Walk-in could not be confirmed. Please retry."); }
    finally { setSaving(false); }
  }
  return (
    <form className="walkin-form" onSubmit={submit}>
      <p className="eyebrow">Walk-in registration</p>
      <div className="form-grid">
        <label className="field"><span>Guest name *</span><input name="name" required minLength={2} maxLength={80} /></label>
        <label className="field"><span>Phone number *</span><input name="phone" type="tel" required minLength={7} /></label>
        <label className="field"><span>Age range *</span><select name="ageBand" defaultValue="" required><option value="" disabled>Select range</option>{AGE_BANDS.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="field"><span>Source *</span><select name="source" defaultValue="" required><option value="" disabled>Select source</option>{REGISTRATION_SOURCES.map((item) => <option key={item}>{item}</option>)}</select></label>
      </div>
      <label className="check-row"><input type="checkbox" name="ageConfirmed" required /><span>Guest confirms she is a woman aged 20 or above. *</span></label>
      <label className="check-row"><input type="checkbox" name="consent" required /><span>Guest consents to registration and attendance record. *</span></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button button-primary" disabled={saving}>{saving ? "Saving…" : "Save walk-in"}</button>
    </form>
  );
}

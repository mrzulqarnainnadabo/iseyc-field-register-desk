"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { AGE_BANDS, REGISTRATION_SOURCES } from "@/lib/gtg-config";

type Registration = { id: string; name: string; phone: string; ageBand: string; status: string; channel: string; submissionId: string; checkedInAt: string | null };
type StatusFilter = "All" | "Registered" | "Checked in";

function makeReference() {
  const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Date.now().toString(36);
  return "GTG-" + id.toUpperCase();
}
function csvCell(value: string) { return '"' + value.replace(/"/g, '""') + '"'; }

export function StaffDesk() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [configured, setConfigured] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [query, setQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [message, setMessage] = useState("");
  const [messageKind, setMessageKind] = useState<"error" | "success" | "info">("info");
  const [busyId, setBusyId] = useState("");
  const [loading, setLoading] = useState(false);
  const [walkInOpen, setWalkInOpen] = useState(false);
  const [filter, setFilter] = useState<StatusFilter>("All");

  const loadRegistrations = useCallback(async (search = "") => {
    setLoading(true);
    try {
      const response = await fetch("/api/staff/registrations?q=" + encodeURIComponent(search), { cache: "no-store" });
      if (response.status === 401) { setAuthenticated(false); setMessage("Your staff session has expired. Sign in again."); setMessageKind("error"); return; }
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Could not load registrations.");
      setRegistrations(result.registrations);
      setAppliedQuery(search);
      setMessage("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The guest list could not be refreshed.");
      setMessageKind("error");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/staff/login", { cache: "no-store" })
      .then((response) => response.json())
      .then(async (result) => {
        if (!active) return;
        setConfigured(Boolean(result.configured));
        if (!result.configured) return;
        const response = await fetch("/api/staff/registrations", { cache: "no-store" });
        if (response.status === 401) return;
        const data = await response.json();
        if (active && response.ok && data.ok) { setAuthenticated(true); setRegistrations(data.registrations || []); }
        else if (active && !response.ok) setMessage(data.error || "The guest list could not be loaded.");
      })
      .catch(() => { if (active) { setMessage("Could not connect to the staff desk. Check your connection and retry."); setMessageKind("error"); } })
      .finally(() => { if (active) setChecking(false); });
    return () => { active = false; };
  }, []);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setMessage("");
    try {
      const response = await fetch("/api/staff/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ passcode }) });
      const result = await response.json();
      if (!response.ok) { setMessage(result.error || "Sign-in failed."); setMessageKind("error"); return; }
      setAuthenticated(true); setPasscode(""); await loadRegistrations();
    } catch { setMessage("Sign-in could not be completed. Check your connection and retry."); setMessageKind("error"); }
  }

  async function checkIn(id: string) {
    setBusyId(id); setMessage("");
    try {
      const response = await fetch("/api/staff/check-in", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      const result = await response.json();
      if (!response.ok) { setMessage(result.error || "Check-in failed."); setMessageKind("error"); return; }
      setMessage(result.alreadyCheckedIn ? "This guest was already checked in." : "Attendance confirmed and saved.");
      setMessageKind("success");
      await loadRegistrations(appliedQuery);
    } catch { setMessage("Check-in could not be confirmed. Please retry before proceeding."); setMessageKind("error"); }
    finally { setBusyId(""); }
  }

  async function logout() {
    try { await fetch("/api/staff/logout", { method: "POST" }); }
    finally { setAuthenticated(false); setRegistrations([]); setMessage("You have signed out."); setMessageKind("info"); }
  }

  const visible = useMemo(() => registrations.filter((guest) => filter === "All" || guest.status === filter), [registrations, filter]);
  const checkedIn = registrations.filter((guest) => guest.status === "Checked in").length;
  const pending = registrations.length - checkedIn;

  function exportVisible() {
    const rows = [["Name", "Phone", "Age range", "Status", "Channel", "Reference", "Checked in at"], ...visible.map((guest) => [guest.name, guest.phone, guest.ageBand, guest.status, guest.channel, guest.submissionId, guest.checkedInAt || ""])];
    const csv = rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url; anchor.download = "gtg-guest-list-" + new Date().toISOString().slice(0, 10) + ".csv";
    anchor.click(); URL.revokeObjectURL(url);
  }

  if (checking) return <div className="staff-state" role="status">Checking staff access…</div>;
  if (!configured) return <div className="staff-login"><p className="eyebrow">Event operations</p><h1>Staff workspace</h1><p>Staff access is not enabled on this review preview. The restricted workspace will become available when its protected environment is configured.</p></div>;
  if (!authenticated) return (
    <div className="staff-login">
      <p className="eyebrow">Event operations</p><h1>Staff access</h1><p>Sign in with the event team access code to manage guest check-in.</p>
      <form onSubmit={login}><label className="field"><span>Staff access code</span><input type="password" value={passcode} onChange={(event) => setPasscode(event.target.value)} autoComplete="current-password" required /></label>{message && <p className="form-error" role="alert">{message}</p>}<button className="button button-primary form-submit" disabled={!passcode.trim()}>Continue <span>↗</span></button></form>
    </div>
  );

  return (
    <div className="staff-workspace">
      <div className="staff-topline"><div><p className="eyebrow">Event operations · Second Edition</p><h1>Guest check-in</h1><p>Find a registered guest, confirm attendance or add a walk-in.</p></div><button className="text-button" onClick={logout}>Sign out</button></div>
      <div className="staff-metrics" aria-label="Guest list summary">
        <article><span>LOADED GUESTS</span><strong>{registrations.length}</strong><small>Latest 30 records or search results</small></article>
        <article><span>CHECKED IN</span><strong>{checkedIn}</strong><small>Attendance confirmed</small></article>
        <article><span>AWAITING ARRIVAL</span><strong>{pending}</strong><small>Not yet checked in</small></article>
      </div>
      <div className="staff-toolbar">
        <form className="staff-search" onSubmit={(event) => { event.preventDefault(); loadRegistrations(query); }}>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, exact phone or reference" aria-label="Search registrations" />
          <button className="button button-primary" disabled={loading}>{loading ? "Searching…" : "Search"}</button>
        </form>
        <button className="button button-outline" onClick={() => setWalkInOpen((value) => !value)}>{walkInOpen ? "Close walk-in" : "Add walk-in"}</button>
        <button className="button button-quiet" onClick={() => loadRegistrations(appliedQuery)} disabled={loading} aria-label="Refresh guest list">↻ Refresh</button>
      </div>
      {message && <p className={"staff-message staff-message-" + messageKind} role={messageKind === "error" ? "alert" : "status"}>{message}</p>}
      {walkInOpen && <WalkInForm onSaved={async (reference) => { setMessage("Walk-in saved and marked checked in. Reference: " + reference); setMessageKind("success"); setWalkInOpen(false); await loadRegistrations(appliedQuery); }} />}
      <div className="staff-list-head"><div><span>GUEST REGISTER</span><small>{visible.length} displayed · {registrations.length} loaded</small></div><button className="text-button" onClick={exportVisible} disabled={visible.length === 0}>Export CSV ↗</button></div>
      <div className="staff-filters" aria-label="Filter guest list">
        {(["All", "Registered", "Checked in"] as StatusFilter[]).map((item) => <button key={item} type="button" className={filter === item ? "staff-filter active" : "staff-filter"} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}{item === "All" ? " · " + registrations.length : item === "Registered" ? " · " + pending : " · " + checkedIn}</button>)}
      </div>
      <div className="staff-list" aria-live="polite">
        {visible.length === 0 ? <div className="staff-empty"><strong>{registrations.length === 0 ? "No guest records loaded" : "No guests in this view"}</strong><p>{registrations.length === 0 ? (appliedQuery ? "No matches found. Try a different name, phone number or reference." : "Refresh the guest list or search for a registration.") : "Choose another attendance filter to see more guests."}</p></div> : visible.map((guest) => (
          <article className="staff-row" key={guest.id}>
            <div className="staff-guest"><strong>{guest.name}</strong><span>{guest.phone} · {guest.ageBand || "Age not recorded"}</span><small>{guest.channel} · {guest.submissionId}</small></div>
            <div className="staff-status"><span className={guest.status === "Checked in" ? "status-checked" : "status-pending"}>{guest.status}</span>{guest.status === "Checked in" ? <small>{guest.checkedInAt ? new Date(guest.checkedInAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Recorded"}</small> : <button className="checkin-button" disabled={busyId === guest.id || Boolean(busyId)} onClick={() => checkIn(guest.id)}>{busyId === guest.id ? "Saving…" : "Check in"}</button>}</div>
          </article>
        ))}
      </div>
      <p className="staff-footnote">This workspace displays up to 30 records per search. Use a name, phone number or reference to find a specific guest.</p>
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

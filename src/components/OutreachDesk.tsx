"use client";

import { useEffect, useState } from "react";
import { PasscodeGate } from "@/components/PasscodeGate";
import { SessionSetup } from "@/components/SessionSetup";
import { ResponseForm } from "@/components/ResponseForm";
import { InsightsDashboard } from "@/components/InsightsDashboard";
import { OfflineProvider } from "@/components/OfflineProvider";
import { PrimaryButton, SecondaryButton } from "@/components/ui/inputs";
import { COPY } from "@/lib/constants";

type SessionListItem = {
  id: string;
  name: string;
  date: string | null;
  programme: string | null;
  community: string | null;
  lga: string | null;
  state: string | null;
};

type HomeTab = "desk" | "insights";

export function OutreachDesk({ passcodeRequired }: { passcodeRequired: boolean }) {
  const [passcode, setPasscode] = useState("");

  return (
    <PasscodeGate required={passcodeRequired} onUnlocked={setPasscode}>
      <OfflineProvider>
        <DeskInner passcode={passcode} />
      </OfflineProvider>
    </PasscodeGate>
  );
}

function DeskInner({ passcode }: { passcode: string }) {
  const [mode, setMode] = useState<"home" | "new" | "capture">("home");
  const [homeTab, setHomeTab] = useState<HomeTab>("desk");
  const [sessions, setSessions] = useState<SessionListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSessionId, setActiveSessionId] = useState("");
  const [activeSessionLabel, setActiveSessionLabel] = useState("");
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    void loadSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadSessions() {
    setLoading(true);
    setLoadError(null);
    try {
      const url = passcode
        ? `/api/sessions?passcode=${encodeURIComponent(passcode)}`
        : "/api/sessions";
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setSessions(data.sessions ?? []);
      } else {
        setLoadError(data.error ?? "Could not load sessions");
      }
    } catch {
      setLoadError("Network error loading sessions");
    } finally {
      setLoading(false);
    }
  }

  function startCapture(id: string, label: string) {
    setActiveSessionId(id);
    setActiveSessionLabel(label);
    setMode("capture");
  }

  if (mode === "new") {
    return (
      <SessionSetup
        passcode={passcode}
        onCreated={(id, label) => {
          void loadSessions();
          startCapture(id, label);
        }}
        onCancel={() => setMode("home")}
      />
    );
  }

  if (mode === "capture" && activeSessionId) {
    return (
      <ResponseForm
        sessionId={activeSessionId}
        sessionLabel={activeSessionLabel}
        passcode={passcode}
        onFinishSession={() => {
          setMode("home");
          setActiveSessionId("");
          setActiveSessionLabel("");
          void loadSessions();
        }}
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex rounded-xl border border-desk-line bg-white p-1">
        <button
          type="button"
          onClick={() => setHomeTab("desk")}
          className={`flex-1 rounded-lg px-3 py-2.5 text-sm font-bold transition ${
            homeTab === "desk"
              ? "bg-desk-green text-white shadow-sm"
              : "text-desk-ink/55 hover:text-desk-ink"
          }`}
        >
          Field desk
        </button>
        <button
          type="button"
          onClick={() => setHomeTab("insights")}
          className={`flex-1 rounded-lg px-3 py-2.5 text-sm font-bold transition ${
            homeTab === "insights"
              ? "bg-desk-green text-white shadow-sm"
              : "text-desk-ink/55 hover:text-desk-ink"
          }`}
        >
          Insights
        </button>
      </div>

      {homeTab === "insights" ? (
        <InsightsDashboard passcode={passcode} />
      ) : (
        <>
          <div className="rounded-2xl border border-desk-line bg-white p-5 text-center sm:p-7">
            <h2 className="text-lg font-extrabold tracking-tight text-desk-ink sm:text-xl">
              Community Outreach Desk
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-desk-ink/60">
              Capture structured community information securely and consistently.
            </p>
            <div className="mt-5 flex flex-col gap-2.5 sm:mx-auto sm:max-w-xs">
              <PrimaryButton type="button" onClick={() => setMode("new")}>
                + Start new outreach
              </PrimaryButton>
            </div>
          </div>

          <div className="rounded-2xl border border-desk-line bg-white p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-desk-ink">Recent sessions</h3>
              <button
                type="button"
                onClick={() => void loadSessions()}
                className="text-xs font-semibold text-desk-ink/45 underline underline-offset-2 hover:text-desk-ink"
              >
                Refresh
              </button>
            </div>

            {loading && (
              <p className="py-6 text-center text-sm text-desk-ink/45">Loading sessions…</p>
            )}

            {loadError && (
              <p className="rounded-xl bg-amber-50 px-3.5 py-3 text-sm text-amber-900">{loadError}</p>
            )}

            {!loading && !loadError && sessions.length === 0 && (
              <p className="py-6 text-center text-sm text-desk-ink/45">{COPY.emptySessionsBody}</p>
            )}

            {!loading && sessions.length > 0 && (
              <ul className="divide-y divide-desk-line">
                {sessions.map((s) => {
                  const label =
                    s.name ||
                    [s.community, s.programme, s.date].filter(Boolean).join(" · ") ||
                    "Untitled session";
                  return (
                    <li key={s.id} className="flex items-center justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-desk-ink">{label}</p>
                        <p className="mt-0.5 text-xs text-desk-ink/45">
                          {[s.state, s.lga, s.date].filter(Boolean).join(" · ")}
                        </p>
                      </div>
                      <SecondaryButton
                        type="button"
                        className="!w-auto shrink-0 !px-3 !py-2 !text-xs"
                        onClick={() => startCapture(s.id, label)}
                      >
                        Continue
                      </SecondaryButton>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}

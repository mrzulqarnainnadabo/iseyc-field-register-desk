"use client";

import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EventStrip } from "@/components/EventStrip";
import { TrustStrip } from "@/components/TrustStrip";
import { Tabs, TabKey } from "@/components/Tabs";
import { RsvpForm } from "@/components/RsvpForm";
import { ParticipationForm } from "@/components/ParticipationForm";
import { COPY, EVENT } from "@/lib/constants";

export default function Page() {
  const defaultTab: TabKey = useMemo(() => {
    const now = new Date();
    const cutoff = new Date(EVENT.isoCutoff);
    return now <= cutoff ? "rsvp" : "participation";
  }, []);

  const [tab, setTab] = useState<TabKey>(defaultTab);
  const [passcodeRequired, setPasscodeRequired] = useState(false);
  const [notionConfigured, setNotionConfigured] = useState(true);

  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then((d) => {
        setPasscodeRequired(Boolean(d.staffPasscodeEnabled));
        setNotionConfigured(Boolean(d.notionConfigured));
      })
      .catch(() => {
        /* submit endpoints still validate server-side */
      });
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
        {!notionConfigured && (
          <div
            className="mb-4 rounded-lg border border-amber-300/80 bg-amber-50 px-3 py-3 text-sm text-amber-950"
            role="status"
          >
            {COPY.configBanner}
          </div>
        )}

        <div className="mb-5">
          <Tabs active={tab} onChange={setTab} />
        </div>

        {tab === "rsvp" ? (
          <div className="flex flex-col gap-4">
            <EventStrip />
            <TrustStrip />
            <p className="text-sm text-desk-ink/70">{COPY.rsvpIntro}</p>
            <RsvpForm />
          </div>
        ) : (
          <ParticipationForm passcodeRequired={passcodeRequired} />
        )}
      </main>

      <Footer />
    </div>
  );
}

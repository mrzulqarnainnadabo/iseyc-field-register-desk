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
  const defaultTab: TabKey = useMemo(() => new Date() <= new Date(EVENT.isoCutoff) ? "rsvp" : "participation", []);
  const [tab, setTab] = useState<TabKey>(defaultTab);
  const [passcodeRequired, setPasscodeRequired] = useState(false);
  const [notionConfigured, setNotionConfigured] = useState(true);

  useEffect(() => {
    fetch("/api/health").then((r) => r.json()).then((d) => { setPasscodeRequired(Boolean(d.staffPasscodeEnabled)); setNotionConfigured(Boolean(d.notionConfigured)); }).catch(() => {});
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-desk-paper">
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6 sm:py-9">
        {!notionConfigured && (
          <div className="mb-6 rounded-2xl border border-amber-300/80 bg-amber-50 px-4 py-3.5 text-sm leading-6 text-amber-950" role="status">
            {COPY.configBanner}
          </div>
        )}

        <div className="mx-auto max-w-3xl">
          <div className="mb-5 sm:mb-6"><Tabs active={tab} onChange={setTab} /></div>
          {tab === "rsvp" ? (
            <div className="space-y-5 sm:space-y-6">
              <EventStrip />
              <TrustStrip />
              <div className="px-1 sm:px-2">
                <p className="text-sm font-medium leading-6 text-desk-ink/65 sm:text-[0.95rem]">{COPY.rsvpIntro}</p>
              </div>
              <RsvpForm />
            </div>
          ) : <ParticipationForm passcodeRequired={passcodeRequired} />}
        </div>
      </main>
      <Footer />
    </div>
  );
}

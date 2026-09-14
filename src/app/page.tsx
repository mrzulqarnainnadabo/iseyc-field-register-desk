"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TrustStrip } from "@/components/TrustStrip";
import { ParticipationForm } from "@/components/ParticipationForm";
import { COPY } from "@/lib/constants";

export default function Page() {
  const [passcodeRequired, setPasscodeRequired] = useState(false);
  const [notionConfigured, setNotionConfigured] = useState(true);

  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then((d) => {
        setPasscodeRequired(Boolean(d.staffPasscodeEnabled));
        setNotionConfigured(Boolean(d.notionConfigured));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-desk-paper">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-7 sm:py-10">
        {!notionConfigured && (
          <div
            className="mx-auto mb-6 max-w-4xl rounded-2xl border border-amber-300/80 bg-amber-50 px-4 py-3.5 text-sm leading-6 text-amber-950"
            role="status"
          >
            {COPY.configBanner}
          </div>
        )}

        <div className="mx-auto max-w-4xl">
          {/* Temporary transitional surface while full Session + Response UI is built */}
          <div className="mb-6 space-y-3">
            <h1 className="text-xl font-semibold tracking-tight text-desk-ink sm:text-2xl">
              Community Outreach Desk
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-desk-ink/65 sm:text-[0.95rem]">
              Capture structured community information securely and consistently.
              This desk collects programme-relevant barriers, knowledge and support
              needs — not medical diagnoses.
            </p>
          </div>

          <TrustStrip />

          <div className="mt-6">
            <ParticipationForm passcodeRequired={passcodeRequired} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

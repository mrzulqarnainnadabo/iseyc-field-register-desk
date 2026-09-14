"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TrustStrip } from "@/components/TrustStrip";
import { OutreachDesk } from "@/components/OutreachDesk";
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

        <div className="mx-auto max-w-4xl space-y-6">
          <TrustStrip />
          <OutreachDesk passcodeRequired={passcodeRequired} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

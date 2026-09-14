"use client";

import { useEffect, useState } from "react";
import { PARTNER, STEWARDSHIP } from "@/lib/constants";
import { PrimaryButton, SecondaryButton } from "@/components/ui/inputs";

type Indicator = {
  value: number;
  numerator: number;
  denominator: number;
};

type InsightsData = {
  sampleSize: number;
  warriors?: number;
  indicators: {
    medicationAccessDifficulty: Indicator;
    investigationAffordability: Indicator;
    genotypeKnowledgeGap: Indicator;
    longTravel: Indicator;
  } | null;
  note?: string;
};

function fmt(ind: Indicator | undefined): string {
  if (!ind || ind.denominator === 0) return "Insufficient data";
  return `${ind.value}% (${ind.numerator} of ${ind.denominator})`;
}

function buildBriefText(data: InsightsData): string {
  const date = new Date().toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const ind = data.indicators;

  return [
    `TIRNGAN SICKLE CELL FOUNDATION`,
    `Community Outreach Evidence Brief`,
    `Prepared for: ${STEWARDSHIP.stewardTitle}`,
    `Date: ${date}`,
    ``,
    `PURPOSE`,
    STEWARDSHIP.purpose,
    ``,
    `SAMPLE`,
    `Total responses analysed: ${data.sampleSize}`,
    `Warriors (self-identified): ${data.warriors ?? 0}`,
    data.note ? `Note: ${data.note}` : ``,
    ``,
    `KEY INDICATORS`,
    `1. Medication access difficulty: ${fmt(ind?.medicationAccessDifficulty)}`,
    `   Share reporting often difficult or very difficult access to medication.`,
    ``,
    `2. Investigation affordability challenge: ${fmt(ind?.investigationAffordability)}`,
    `   Share reporting investigations as usually or completely unaffordable.`,
    ``,
    `3. Genotype knowledge gap: ${fmt(ind?.genotypeKnowledgeGap)}`,
    `   Share who do not know or are unsure of their genotype.`,
    ``,
    `4. Long travel to facility: ${fmt(ind?.longTravel)}`,
    `   Share travelling one hour or more to reach their usual health facility.`,
    ``,
    `HOW TO USE THIS BRIEF`,
    `• Prioritise programmes where the highest percentages appear.`,
    `• Share with government agencies, healthcare partners and donors as evidence of need.`,
    `• Combine with qualitative field notes for proposals and advocacy.`,
    ``,
    `DATA STEWARDSHIP`,
    `This evidence is generated from community outreach responses collected under the`,
    `stewardship of ${STEWARDSHIP.stewardTitle}.`,
    `Data owner: ${STEWARDSHIP.dataOwner}`,
    `Platform partnership: ISEYC × TIRNGAN Community Outreach Intelligence Desk`,
    ``,
    `Confidentiality: Programme intelligence only. No medical diagnoses or clinical records.`,
  ]
    .filter((line) => line !== undefined)
    .join("\n");
}

export function FounderBrief({ passcode }: { passcode: string }) {
  const [data, setData] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load() {
    setLoading(true);
    try {
      const url = passcode
        ? `/api/insights?passcode=${encodeURIComponent(passcode)}`
        : "/api/insights";
      const res = await fetch(url);
      const json = await res.json();
      setData(json);
    } catch {
      setData({ sampleSize: 0, indicators: null });
    } finally {
      setLoading(false);
    }
  }

  async function copyBrief() {
    if (!data) return;
    const text = buildBriefText(data);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback: open print view which includes the same text
      window.print();
    }
  }

  function printBrief() {
    window.print();
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-desk-line bg-white p-6 text-center text-sm text-desk-ink/45">
        Preparing founder brief…
      </div>
    );
  }

  const ind = data?.indicators;
  const dateLabel = new Date().toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-4">
      {/* Ownership banner */}
      <div className="rounded-2xl border border-desk-green/25 bg-desk-green/5 p-4 sm:p-5">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-desk-green">
          Founder evidence brief
        </p>
        <h2 className="mt-1 text-base font-extrabold tracking-tight text-desk-ink sm:text-lg">
          Prepared for {PARTNER.founder}
        </h2>
        <p className="mt-1 text-sm text-desk-ink/60">{STEWARDSHIP.stewardTitle}</p>
        <p className="mt-3 text-xs leading-5 text-desk-ink/55">{STEWARDSHIP.purpose}</p>
      </div>

      {/* Printable brief body */}
      <div
        id="founder-brief"
        className="rounded-2xl border border-desk-line bg-white p-5 sm:p-6 print:border-0 print:p-0"
      >
        <div className="border-b border-desk-line pb-4">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-desk-ink/40">
            Tirngan Sickle Cell Foundation
          </p>
          <h3 className="mt-1 text-lg font-extrabold text-desk-ink">
            Community Outreach Evidence Brief
          </h3>
          <p className="mt-1 text-sm text-desk-ink/55">
            For {STEWARDSHIP.stewardTitle} · {dateLabel}
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl bg-desk-paper/80 p-3 text-center">
            <p className="text-2xl font-extrabold text-desk-ink">{data?.sampleSize ?? 0}</p>
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.1em] text-desk-ink/40">
              Responses
            </p>
          </div>
          <div className="rounded-xl bg-desk-paper/80 p-3 text-center">
            <p className="text-2xl font-extrabold text-desk-ink">{data?.warriors ?? 0}</p>
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.1em] text-desk-ink/40">
              Warriors
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <BriefRow
            title="Medication access difficulty"
            value={fmt(ind?.medicationAccessDifficulty)}
            detail="Often difficult or very difficult access to medication"
          />
          <BriefRow
            title="Investigation affordability challenge"
            value={fmt(ind?.investigationAffordability)}
            detail="Usually or completely unaffordable investigations"
          />
          <BriefRow
            title="Genotype knowledge gap"
            value={fmt(ind?.genotypeKnowledgeGap)}
            detail="Does not know or is unsure of genotype"
          />
          <BriefRow
            title="Long travel to facility"
            value={fmt(ind?.longTravel)}
            detail="One hour or more to usual health facility"
          />
        </div>

        <div className="mt-6 rounded-xl bg-desk-paper/60 p-4 text-xs leading-5 text-desk-ink/60">
          <p className="font-semibold text-desk-ink/80">How to use this brief</p>
          <ul className="mt-2 list-disc space-y-1 pl-4">
            <li>Prioritise programmes where the highest percentages appear.</li>
            <li>Share with government, healthcare partners and donors as evidence of need.</li>
            <li>Combine with field notes for proposals and advocacy.</li>
          </ul>
          <p className="mt-3 text-desk-ink/50">
            Data owner: {STEWARDSHIP.dataOwner} · Stewardship: {STEWARDSHIP.dataSteward} ·
            Platform: ISEYC × TIRNGAN
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 sm:flex-row print:hidden">
        <PrimaryButton type="button" onClick={printBrief}>
          Print / Save as PDF
        </PrimaryButton>
        <SecondaryButton type="button" onClick={() => void copyBrief()}>
          {copied ? "Copied to clipboard" : "Copy brief text"}
        </SecondaryButton>
      </div>
    </div>
  );
}

function BriefRow({
  title,
  value,
  detail,
}: {
  title: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-desk-line/70 pb-3">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-desk-ink">{title}</p>
        <p className="mt-0.5 text-xs text-desk-ink/50">{detail}</p>
      </div>
      <p className="shrink-0 text-right text-sm font-extrabold text-desk-green">{value}</p>
    </div>
  );
}

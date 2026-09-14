"use client";

import { useEffect, useState } from "react";
import { FounderBrief } from "@/components/FounderBrief";
import { COPY } from "@/lib/constants";

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
  error?: string;
};

function InsightCard({
  title,
  indicator,
  description,
}: {
  title: string;
  indicator: Indicator;
  description: string;
}) {
  const empty = indicator.denominator === 0;
  return (
    <div className="rounded-2xl border border-desk-line bg-white p-4 sm:p-5">
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-desk-ink/40">
        {title}
      </p>
      <p className="mt-2 text-3xl font-extrabold tracking-tight text-desk-ink">
        {empty ? "—" : `${indicator.value}%`}
      </p>
      <p className="mt-1 text-xs text-desk-ink/50">
        {empty
          ? "No valid responses yet"
          : `${indicator.numerator} / ${indicator.denominator} responses`}
      </p>
      <p className="mt-2 text-xs leading-5 text-desk-ink/55">{description}</p>
    </div>
  );
}

export function InsightsDashboard({ passcode }: { passcode: string }) {
  const [data, setData] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"dashboard" | "brief">("dashboard");

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
      setData({ sampleSize: 0, indicators: null, error: "Could not load insights" });
    } finally {
      setLoading(false);
    }
  }

  if (view === "brief") {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setView("dashboard")}
          className="text-xs font-semibold text-desk-ink/50 underline underline-offset-2 hover:text-desk-ink print:hidden"
        >
          ← Back to insights
        </button>
        <FounderBrief passcode={passcode} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-desk-line bg-white p-6 text-center text-sm text-desk-ink/45">
        Loading community intelligence…
      </div>
    );
  }

  if (!data?.indicators || data.sampleSize === 0) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-desk-line bg-white p-6 text-center">
          <p className="text-sm font-semibold text-desk-ink">{COPY.emptyInsightsTitle}</p>
          <p className="mt-1 text-sm text-desk-ink/55">
            {data?.note || data?.error || COPY.emptyInsightsBody}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setView("brief")}
          className="w-full rounded-xl border border-desk-green/30 bg-desk-green/5 px-4 py-3 text-sm font-bold text-desk-green transition hover:bg-desk-green/10"
        >
          Open founder evidence brief →
        </button>
      </div>
    );
  }

  const ind = data.indicators;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-extrabold text-desk-ink">Community intelligence</h2>
          <p className="text-xs text-desk-ink/50">{data.note}</p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="text-xs font-semibold text-desk-ink/45 underline underline-offset-2 hover:text-desk-ink"
        >
          Refresh
        </button>
      </div>

      <button
        type="button"
        onClick={() => setView("brief")}
        className="w-full rounded-xl border border-desk-green/30 bg-desk-green/5 px-4 py-3.5 text-left transition hover:bg-desk-green/10"
      >
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-desk-green">
          For the founder
        </p>
        <p className="mt-0.5 text-sm font-extrabold text-desk-ink">
          Open evidence brief for Miracle Sim Danjuma
        </p>
        <p className="mt-1 text-xs text-desk-ink/55">
          Printable summary · Copy for email · Share with partners and donors
        </p>
      </button>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-desk-line bg-white p-4 text-center">
          <p className="text-2xl font-extrabold text-desk-ink">{data.sampleSize}</p>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.1em] text-desk-ink/40">
            Responses
          </p>
        </div>
        <div className="rounded-2xl border border-desk-line bg-white p-4 text-center">
          <p className="text-2xl font-extrabold text-desk-ink">{data.warriors ?? 0}</p>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.1em] text-desk-ink/40">
            Warriors
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <InsightCard
          title="Medication access difficulty"
          indicator={ind.medicationAccessDifficulty}
          description="Share of valid responses reporting often difficult or very difficult access to medication."
        />
        <InsightCard
          title="Investigation affordability"
          indicator={ind.investigationAffordability}
          description="Share reporting investigations as usually or completely unaffordable."
        />
        <InsightCard
          title="Genotype knowledge gap"
          indicator={ind.genotypeKnowledgeGap}
          description="Share who do not know or are unsure of their genotype."
        />
        <InsightCard
          title="Long travel to facility"
          indicator={ind.longTravel}
          description="Share travelling 1 hour or more to reach their usual health facility."
        />
      </div>
    </div>
  );
}

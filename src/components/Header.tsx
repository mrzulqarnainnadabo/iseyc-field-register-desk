"use client";

import { ORG, PARTNER, SITE } from "@/lib/constants";
import { useState } from "react";

function BrandMark({ src, alt, fallback, className = "" }: { src: string; alt: string; fallback: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <span className={`flex h-full w-full items-center justify-center px-2 text-center text-[0.62rem] font-extrabold uppercase tracking-[0.08em] text-desk-green ${className}`}>{fallback}</span>;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={`h-full w-full object-contain ${className}`} onError={() => setFailed(true)} />
  );
}

export function Header() {
  return (
    <header className="border-b border-black/10 bg-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex min-h-[92px] items-center justify-between gap-4 py-4 sm:min-h-[104px] sm:py-5">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <div className="flex h-[62px] w-[62px] shrink-0 items-center justify-center rounded-2xl bg-white p-1 shadow-[0_8px_24px_rgba(16,34,27,0.10)] ring-1 ring-black/10 sm:h-[74px] sm:w-[74px]">
              <BrandMark src="/brand/iseyc.svg" alt={ORG.name} fallback="ISEYC" />
            </div>
            <div className="min-w-0">
              <p className="text-[0.66rem] font-bold uppercase tracking-[0.18em] text-desk-green/70">{ORG.name}</p>
              <p className="mt-1 max-w-[240px] text-sm font-extrabold leading-tight text-desk-ink sm:max-w-none sm:text-base">{SITE.productName}</p>
              <p className="mt-1 hidden text-xs leading-5 text-desk-ink/55 sm:block">A simple, trusted registration desk for programme participation.</p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3 sm:gap-4">
            <div className="hidden h-10 w-px bg-black/10 sm:block" aria-hidden />
            <div className="flex h-[62px] w-[118px] items-center justify-center rounded-2xl bg-white px-2 shadow-[0_8px_24px_rgba(16,34,27,0.08)] ring-1 ring-black/10 sm:h-[74px] sm:w-[150px]">
              <BrandMark src="/brand/tirngan.svg" alt={PARTNER.name} fallback="Tirngan" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-black/[0.07] py-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-desk-ink/70">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-desk-green text-[10px] font-black text-white">✓</span>
            <span>{ORG.partnershipLine}</span>
          </div>
          <span className="text-[0.64rem] font-bold uppercase tracking-[0.12em] text-desk-ink/45">Official programme registration</span>
        </div>
      </div>
    </header>
  );
}

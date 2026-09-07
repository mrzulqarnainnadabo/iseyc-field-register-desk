"use client";

import { ORG, PARTNER, SITE } from "@/lib/constants";
import { useState } from "react";

function BrandMark({ src, alt, fallback }: { src: string; alt: string; fallback: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <span className="flex h-full w-full items-center justify-center px-2 text-center text-[0.58rem] font-extrabold uppercase tracking-[0.08em] text-desk-green">{fallback}</span>;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className="h-full w-full object-contain p-1.5" onError={() => setFailed(true)} />
  );
}

export function Header() {
  return (
    <header className="relative overflow-hidden border-b border-white/10 bg-desk-green text-white">
      <div className="pointer-events-none absolute inset-0 opacity-20 [background:radial-gradient(circle_at_20%_0%,white,transparent_35%),radial-gradient(circle_at_85%_100%,#f4e500,transparent_28%)]" />
      <div className="relative mx-auto max-w-3xl px-4 pb-5 pt-4 sm:px-6 sm:pb-6">
        <div className="flex items-center gap-3 sm:gap-5">
          <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white p-1 shadow-lg ring-1 ring-white/20 sm:h-16 sm:w-16">
              <BrandMark src="/brand/tirngan.svg" alt={PARTNER.name} fallback="Tirngan" />
            </div>
            <div className="min-w-0">
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-white/65">{PARTNER.shortName}</p>
              <p className="mt-0.5 text-sm font-bold leading-tight sm:text-base">{SITE.productName}</p>
              <p className="mt-1 hidden text-xs text-white/60 sm:block">A secure field registration desk</p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 border-l border-white/15 pl-3 sm:gap-3 sm:pl-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white shadow-lg ring-1 ring-white/20 sm:h-16 sm:w-16">
              <BrandMark src="/brand/iseyc.svg" alt={ORG.name} fallback="ISEYC" />
            </div>
            <div className="hidden text-right sm:block">
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-white/55">Systems partner</p>
              <p className="mt-1 text-sm font-bold">{ORG.name}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-t border-white/10 pt-4 text-center">
          <p className="text-xs font-medium leading-relaxed text-white/85 sm:text-sm">{ORG.partnershipLine}</p>
          <span className="hidden h-1 w-1 rounded-full bg-white/40 sm:block" aria-hidden />
          <p className="text-[0.68rem] font-medium uppercase tracking-[0.1em] text-white/55">Programme records · Not a medical record</p>
        </div>
      </div>
    </header>
  );
}

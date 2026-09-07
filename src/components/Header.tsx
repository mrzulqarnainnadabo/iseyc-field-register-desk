"use client";

import { ORG, PARTNER } from "@/lib/constants";
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
    <header className="border-b border-black/[0.07] bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 sm:px-7">
        <div className="flex min-h-[76px] items-center justify-between gap-5 py-3.5 sm:min-h-[88px] sm:py-4">
          <div className="flex min-w-0 items-center gap-3.5 sm:gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center sm:h-14 sm:w-14">
              <BrandMark src="/brand/iseyc-mark.svg" alt="ISEYC" fallback="ISEYC" />
            </div>
            <div className="min-w-0">
              <p className="text-[0.66rem] font-extrabold uppercase tracking-[0.2em] text-desk-green">ISEYC × TIRNGAN</p>
              <p className="mt-0.5 truncate text-sm font-semibold tracking-[-0.01em] text-desk-ink sm:text-[0.92rem]">Joint Registration Desk</p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <div className="hidden h-9 w-px bg-black/10 sm:block" aria-hidden />
            <div className="h-11 w-[128px] sm:h-12 sm:w-[155px]">
              <BrandMark src="/brand/tirngan.svg" alt={PARTNER.name} fallback="Tirngan" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-black/[0.06] py-2.5">
          <div className="flex min-w-0 items-center gap-2 text-[0.68rem] font-semibold text-desk-ink/60 sm:text-xs">
            <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-desk-green text-[10px] font-black text-white">✓</span>
            <span className="truncate">{ORG.partnershipLine}</span>
          </div>
          <span className="hidden shrink-0 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-desk-ink/35 sm:block">Official registration</span>
        </div>
      </div>
    </header>
  );
}

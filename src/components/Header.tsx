"use client";

import { ORG, PARTNER } from "@/lib/constants";
import { useState } from "react";

function BrandMark({
  src,
  alt,
  fallback,
}: {
  src: string;
  alt: string;
  fallback: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span className="flex h-full w-full items-center justify-center px-1 text-center text-[0.55rem] font-extrabold uppercase tracking-[0.06em] text-desk-green">
        {fallback}
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="h-full w-full object-contain p-1"
      onError={() => setFailed(true)}
    />
  );
}

export function Header() {
  return (
    <header className="border-b border-black/[0.07] bg-white">
      <div className="mx-auto max-w-6xl px-3 sm:px-7">
        <div className="flex min-h-[84px] items-center justify-between gap-3 py-3 sm:min-h-[96px] sm:gap-5 sm:py-4">
          {/* ISEYC mark — larger, clear frame */}
          <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-desk-line bg-white shadow-sm sm:h-16 sm:w-16">
              <BrandMark src="/brand/iseyc.svg" alt="ISEYC" fallback="ISEYC" />
            </div>
            <div className="min-w-0">
              <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-desk-green sm:text-[0.66rem] sm:tracking-[0.2em]">
                ISEYC × TIRNGAN
              </p>
              <p className="mt-0.5 text-[0.8rem] font-semibold leading-snug tracking-[-0.01em] text-desk-ink sm:text-[0.95rem]">
                Community Outreach
                <span className="hidden sm:inline"> Intelligence Desk</span>
                <span className="sm:hidden"> Desk</span>
              </p>
            </div>
          </div>

          {/* Tirngan mark — larger on mobile */}
          <div className="flex h-12 w-[110px] shrink-0 items-center justify-center rounded-xl border border-desk-line bg-white px-1.5 shadow-sm sm:h-14 sm:w-[160px] sm:px-2">
            <BrandMark src="/brand/tirngan.svg" alt={PARTNER.name} fallback="Tirngan" />
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-black/[0.06] py-2.5">
          <div className="flex min-w-0 items-center gap-2 text-[0.65rem] font-semibold text-desk-ink/60 sm:text-xs">
            <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-desk-green text-[10px] font-black text-white">
              ✓
            </span>
            <span className="truncate">{ORG.partnershipLine}</span>
          </div>
          <span className="hidden shrink-0 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-desk-ink/40 sm:block">
            Stewardship · {PARTNER.founder}
          </span>
        </div>
      </div>
    </header>
  );
}

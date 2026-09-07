import { ORG, PARTNER, SITE } from "@/lib/constants";

/**
 * Dual-organisation lockup — programme owner first, systems partner second.
 * Place real logos at /public/brand/tirngan.png and /public/brand/iseyc.png
 */
export function Header() {
  return (
    <header className="border-b border-desk-line bg-desk-green text-white">
      <div className="mx-auto max-w-2xl px-4 pb-5 pt-4">
        {/* Co-brand row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {/* Tirngan mark */}
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/tirngan.png"
                alt={PARTNER.name}
                className="h-10 w-10 object-contain"
                onError={(e) => {
                  const el = e.currentTarget;
                  el.style.display = "none";
                  const fallback = el.nextElementSibling as HTMLElement | null;
                  if (fallback) fallback.style.display = "flex";
                }}
              />
              <span
                className="hidden h-full w-full items-center justify-center text-[0.55rem] font-bold uppercase tracking-wide text-desk-green"
                style={{ display: "none" }}
                aria-hidden
              >
                TSF
              </span>
            </div>
            <div className="min-w-0">
              <p className="truncate text-[0.7rem] font-medium uppercase tracking-[0.12em] text-white/70">
                {PARTNER.shortName}
              </p>
              <p className="truncate text-sm font-semibold leading-tight text-white">
                {SITE.productName}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-1">
            <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-white/95 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/iseyc.png"
                alt={ORG.name}
                className="h-9 w-9 object-contain"
                onError={(e) => {
                  const el = e.currentTarget;
                  el.style.display = "none";
                  const fallback = el.nextElementSibling as HTMLElement | null;
                  if (fallback) fallback.style.display = "flex";
                }}
              />
              <span
                className="hidden h-full w-full items-center justify-center text-[0.55rem] font-bold tracking-wide text-desk-green"
                style={{ display: "none" }}
                aria-hidden
              >
                {ORG.name}
              </span>
            </div>
            <span className="text-[0.6rem] font-medium uppercase tracking-wide text-white/60">
              Powered by {ORG.name}
            </span>
          </div>
        </div>

        <p className="mt-4 text-center text-xs leading-relaxed text-white/80">
          {ORG.partnershipLine}
        </p>
        <p className="mt-1 text-center text-[0.7rem] text-white/55">
          Programme records only · Not a medical record
        </p>
      </div>
    </header>
  );
}

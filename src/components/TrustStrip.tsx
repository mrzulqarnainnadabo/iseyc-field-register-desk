import { COPY } from "@/lib/constants";

export function TrustStrip() {
  return (
    <p className="rounded-lg border border-desk-line/80 bg-white/80 px-3 py-2.5 text-center text-xs leading-relaxed text-desk-ink/70">
      {COPY.trustStrip}
    </p>
  );
}

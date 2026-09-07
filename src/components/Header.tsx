import { ORG } from "@/lib/constants";

export function Header() {
  return (
    <header className="border-b border-desk-line bg-desk-green text-white">
      <div className="mx-auto max-w-2xl px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-bold tracking-wide">
            {ORG.name}
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-tight">Field Register Desk</h1>
            <p className="text-sm text-white/80">{ORG.supportLine}</p>
          </div>
        </div>
        <p className="mt-3 text-xs uppercase tracking-wide text-white/60">
          Programme records · Not a medical record
        </p>
      </div>
    </header>
  );
}

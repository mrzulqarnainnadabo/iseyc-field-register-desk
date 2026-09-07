import { EVENT } from "@/lib/constants";

export function EventStrip() {
  return (
    <div className="rounded-xl border border-desk-line bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-desk-accent">
        {EVENT.programme}
      </p>
      <p className="mt-0.5 text-base font-semibold text-desk-ink">{EVENT.name}</p>
      <p className="text-sm italic text-desk-ink/70">&ldquo;{EVENT.theme}&rdquo;</p>

      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
        <div>
          <dt className="text-desk-ink/50">Date</dt>
          <dd className="font-medium text-desk-ink">{EVENT.date}</dd>
        </div>
        <div>
          <dt className="text-desk-ink/50">Red carpet · Dinner</dt>
          <dd className="font-medium text-desk-ink">
            {EVENT.redCarpet} · {EVENT.dinner}
          </dd>
        </div>
        <div className="col-span-2">
          <dt className="text-desk-ink/50">Venue</dt>
          <dd className="font-medium text-desk-ink">{EVENT.venue}</dd>
        </div>
      </dl>
    </div>
  );
}

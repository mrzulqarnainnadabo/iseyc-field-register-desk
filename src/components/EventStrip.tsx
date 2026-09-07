import { EVENT } from "@/lib/constants";

export function EventStrip() {
  return (
    <section className="rounded-xl border border-desk-line bg-white p-4 shadow-sm">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-desk-accent">
        {EVENT.programme}
      </p>
      <h2 className="mt-1 text-lg font-semibold leading-snug text-desk-ink">{EVENT.name}</h2>
      <p className="mt-1 text-sm leading-snug text-desk-ink/65">&ldquo;{EVENT.theme}&rdquo;</p>

      <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-3 border-t border-desk-line/80 pt-3 text-sm">
        <div>
          <dt className="text-[0.7rem] uppercase tracking-wide text-desk-ink/45">Date</dt>
          <dd className="mt-0.5 font-medium text-desk-ink">{EVENT.date}</dd>
        </div>
        <div>
          <dt className="text-[0.7rem] uppercase tracking-wide text-desk-ink/45">
            Red carpet · Dinner
          </dt>
          <dd className="mt-0.5 font-medium text-desk-ink">
            {EVENT.redCarpet} · {EVENT.dinner}
          </dd>
        </div>
        <div className="col-span-2">
          <dt className="text-[0.7rem] uppercase tracking-wide text-desk-ink/45">Venue</dt>
          <dd className="mt-0.5 font-medium leading-snug text-desk-ink">{EVENT.venue}</dd>
        </div>
      </dl>
    </section>
  );
}

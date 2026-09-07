import { EVENT } from "@/lib/constants";

export function EventStrip() {
  return (
    <section className="overflow-hidden rounded-2xl border border-desk-line bg-white shadow-sm">
      <div className="border-l-4 border-desk-accent px-4 py-4 sm:px-5 sm:py-5">
        <p className="text-[0.66rem] font-extrabold uppercase tracking-[0.16em] text-desk-accent">{EVENT.programme}</p>
        <h1 className="mt-1 text-xl font-extrabold tracking-tight text-desk-ink sm:text-2xl">{EVENT.name}</h1>
        <p className="mt-1 text-sm font-medium leading-6 text-desk-ink/60">“{EVENT.theme}”</p>
        <dl className="mt-4 grid gap-3 border-t border-desk-line/80 pt-4 sm:grid-cols-3 sm:gap-4">
          <div><dt className="text-[0.66rem] font-bold uppercase tracking-[0.1em] text-desk-ink/45">Date</dt><dd className="mt-1 text-sm font-bold text-desk-ink">{EVENT.date}</dd></div>
          <div><dt className="text-[0.66rem] font-bold uppercase tracking-[0.1em] text-desk-ink/45">Red carpet · Dinner</dt><dd className="mt-1 text-sm font-bold text-desk-ink">{EVENT.redCarpet} · {EVENT.dinner}</dd></div>
          <div><dt className="text-[0.66rem] font-bold uppercase tracking-[0.1em] text-desk-ink/45">Venue</dt><dd className="mt-1 text-sm font-bold leading-5 text-desk-ink">{EVENT.venue}</dd></div>
        </dl>
      </div>
    </section>
  );
}

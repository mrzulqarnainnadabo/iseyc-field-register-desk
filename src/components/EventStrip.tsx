import { EVENT } from "@/lib/constants";

export function EventStrip() {
  return (
    <section className="overflow-hidden rounded-3xl border border-black/8 bg-white shadow-[0_14px_40px_rgba(16,34,27,0.07)]">
      <div className="border-t-4 border-desk-accent px-4 py-5 sm:px-6 sm:py-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-desk-green/8 px-2.5 py-1 text-[0.64rem] font-extrabold uppercase tracking-[0.13em] text-desk-green">Official programme</span>
          <span className="text-xs font-medium text-desk-ink/45">Registration desk</span>
        </div>
        <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-desk-green/65">{EVENT.programme}</p>
        <h1 className="mt-1.5 max-w-2xl text-2xl font-extrabold leading-tight text-desk-ink sm:text-3xl">{EVENT.name}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-desk-ink/60 sm:text-[0.95rem]">{EVENT.theme}</p>

        <dl className="mt-6 grid gap-0 border-t border-desk-line/80 sm:grid-cols-3">
          <div className="border-b border-desk-line/70 py-3.5 sm:border-b-0 sm:border-r sm:pr-5">
            <dt className="text-[0.64rem] font-extrabold uppercase tracking-[0.12em] text-desk-ink/40">Date</dt>
            <dd className="mt-1 text-sm font-bold text-desk-ink">{EVENT.date}</dd>
          </div>
          <div className="border-b border-desk-line/70 py-3.5 sm:border-b-0 sm:border-r sm:px-5">
            <dt className="text-[0.64rem] font-extrabold uppercase tracking-[0.12em] text-desk-ink/40">Programme time</dt>
            <dd className="mt-1 text-sm font-bold text-desk-ink">{EVENT.redCarpet} <span className="font-normal text-desk-ink/40">·</span> {EVENT.dinner}</dd>
          </div>
          <div className="py-3.5 sm:pl-5">
            <dt className="text-[0.64rem] font-extrabold uppercase tracking-[0.12em] text-desk-ink/40">Venue</dt>
            <dd className="mt-1 text-sm font-bold leading-5 text-desk-ink">{EVENT.venue}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

import { EVENT } from "@/lib/constants";

export function EventStrip() {
  return (
    <section className="overflow-hidden rounded-[28px] border border-black/[0.07] bg-white shadow-[0_24px_70px_rgba(16,34,27,0.08)]">
      <div className="relative overflow-hidden bg-[#0b6848] px-5 pb-6 pt-6 text-white sm:px-8 sm:pb-8 sm:pt-8">
        <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full border-[42px] border-white/[0.055]" />
        <div className="pointer-events-none absolute -bottom-28 -left-24 h-64 w-64 rounded-full border-[34px] border-[#e8d900]/[0.10]" />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/12 px-3 py-1.5 text-[0.62rem] font-extrabold uppercase tracking-[0.15em] text-white ring-1 ring-white/15">5th Anniversary</span>
            <span className="text-[0.68rem] font-semibold text-white/65">Official event registration</span>
          </div>

          <p className="mt-7 text-[0.68rem] font-bold uppercase tracking-[0.19em] text-[#f3e95c]">{EVENT.programme}</p>
          <h1 className="mt-2 max-w-3xl text-[2rem] font-extrabold leading-[1.08] tracking-[-0.045em] sm:text-[2.85rem]">{EVENT.name}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/72 sm:text-[0.98rem]">{EVENT.theme}</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-3">
        <div className="border-b border-black/[0.07] px-5 py-4 sm:border-b-0 sm:border-r sm:px-6 sm:py-5">
          <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.14em] text-desk-ink/40">Date</p>
          <p className="mt-1.5 text-sm font-bold text-desk-ink sm:text-[0.92rem]">{EVENT.date}</p>
        </div>
        <div className="border-b border-black/[0.07] px-5 py-4 sm:border-b-0 sm:border-r sm:px-6 sm:py-5">
          <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.14em] text-desk-ink/40">Arrival & dinner</p>
          <p className="mt-1.5 text-sm font-bold text-desk-ink sm:text-[0.92rem]">{EVENT.redCarpet} · {EVENT.dinner}</p>
        </div>
        <div className="px-5 py-4 sm:px-6 sm:py-5">
          <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.14em] text-desk-ink/40">Venue</p>
          <p className="mt-1.5 text-sm font-bold leading-5 text-desk-ink sm:text-[0.92rem]">{EVENT.venue}</p>
        </div>
      </div>
    </section>
  );
}

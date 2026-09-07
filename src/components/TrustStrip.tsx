import { COPY } from "@/lib/constants";

const trustItems = [
  { icon: "✓", title: "Event planning", body: "Used to prepare attendance, seating, recognition and follow-up." },
  { icon: "✓", title: "Official desk", body: "Your response is submitted through the programme registration system." },
  { icon: "i", title: "Privacy first", body: "No medical or clinical information is requested on this form." },
];

export function TrustStrip() {
  return (
    <section aria-label="Registration information" className="overflow-hidden rounded-[24px] border border-black/[0.07] bg-white shadow-[0_14px_40px_rgba(16,34,27,0.055)]">
      <div className="border-b border-black/[0.06] px-4 py-4 sm:px-5 sm:py-4.5">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-desk-green text-sm font-black text-white" aria-hidden>✓</span>
          <div>
            <h2 className="text-sm font-extrabold tracking-[-0.02em] text-desk-ink sm:text-[0.96rem]">A registration desk you can trust</h2>
            <p className="mt-1 max-w-2xl text-xs leading-5 text-desk-ink/55 sm:text-sm">{COPY.trustStrip}</p>
          </div>
        </div>
      </div>
      <div className="grid divide-y divide-black/[0.06] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {trustItems.map((item) => (
          <div key={item.title} className="px-4 py-3.5 sm:px-5 sm:py-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-desk-green/[0.09] text-xs font-extrabold text-desk-green" aria-hidden>{item.icon}</span>
              <p className="text-xs font-extrabold text-desk-ink sm:text-[0.8rem]">{item.title}</p>
            </div>
            <p className="mt-2 pl-[37px] text-[0.72rem] leading-5 text-desk-ink/50">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

import { COPY } from "@/lib/constants";

const trustItems = [
  { icon: "✓", title: "Programme use", body: "Details are used for event planning and programme records." },
  { icon: "↗", title: "Secure submission", body: "Your response is sent through the register desk server." },
  { icon: "i", title: "Not medical care", body: "This desk does not create or replace a medical record." },
];

export function TrustStrip() {
  return (
    <section aria-label="Registration trust information" className="rounded-2xl border border-desk-green/15 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-desk-green text-xs font-black text-white" aria-hidden>✓</span>
        <div>
          <h2 className="text-sm font-bold text-desk-ink">A clear, responsible registration</h2>
          <p className="text-xs text-desk-ink/55">{COPY.trustStrip}</p>
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        {trustItems.map((item) => (
          <div key={item.title} className="rounded-xl border border-desk-line/70 bg-desk-paper/55 p-3">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-desk-green/10 text-xs font-bold text-desk-green" aria-hidden>{item.icon}</span>
              <p className="text-xs font-bold text-desk-ink">{item.title}</p>
            </div>
            <p className="mt-1.5 text-[0.7rem] leading-relaxed text-desk-ink/60">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

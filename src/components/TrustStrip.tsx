import { COPY } from "@/lib/constants";

const trustItems = [
  { icon: "✓", title: "Programme use", body: "Used to plan attendance, seating, recognition and follow-up." },
  { icon: "⌁", title: "Secure response", body: "Your registration is submitted through the official desk." },
  { icon: "i", title: "Privacy boundary", body: "This form is for programme records, not clinical or medical records." },
];

export function TrustStrip() {
  return (
    <section aria-label="Registration information" className="overflow-hidden rounded-2xl border border-desk-green/15 bg-white shadow-[0_10px_30px_rgba(16,34,27,0.05)]">
      <div className="border-b border-desk-green/10 bg-desk-green/[0.035] px-4 py-4 sm:px-5">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-desk-green text-sm font-black text-white" aria-hidden>✓</span>
          <div>
            <h2 className="font-display text-sm font-extrabold tracking-tight text-desk-ink sm:text-base">Your information, used responsibly</h2>
            <p className="mt-1 max-w-2xl text-xs leading-5 text-desk-ink/60 sm:text-sm">{COPY.trustStrip}</p>
          </div>
        </div>
      </div>
      <div className="grid divide-y divide-desk-line/70 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {trustItems.map((item) => (
          <div key={item.title} className="px-4 py-3.5 sm:px-4 sm:py-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-desk-green/10 text-xs font-extrabold text-desk-green" aria-hidden>{item.icon}</span>
              <p className="text-xs font-extrabold text-desk-ink sm:text-[0.8rem]">{item.title}</p>
            </div>
            <p className="mt-2 pl-[37px] text-[0.72rem] leading-5 text-desk-ink/55">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

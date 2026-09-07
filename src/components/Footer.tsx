import { ORG, EVENT } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-desk-line bg-white">
      <div className="mx-auto max-w-2xl px-4 py-6 text-center text-xs leading-relaxed text-desk-ink/65">
        <p className="font-medium text-desk-ink/80">{ORG.partnershipLine}</p>
        <p className="mt-2">
          Powered by {ORG.name} · {ORG.fullName}
        </p>
        <p className="mt-1">
          {EVENT.programme} leads the programme. ISEYC provides this register desk as
          community systems support.
        </p>
        <p className="mt-2">
          Records held for programme integrity and recognition · Not a medical record
        </p>
      </div>
    </footer>
  );
}

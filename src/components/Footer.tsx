import { COPY, ORG, PARTNER, STEWARDSHIP } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-desk-line bg-white">
      <div className="mx-auto max-w-2xl px-4 py-7 text-center text-xs leading-relaxed text-desk-ink/65">
        <div className="mb-3 flex items-center justify-center gap-4">
          <div className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-desk-ink/50">
            ISEYC × TIRNGAN
          </div>
        </div>
        <p className="font-medium text-desk-ink/80">{COPY.footerOwner}</p>
        <p className="mt-2">{COPY.footerPrivacy}</p>
        <p className="mt-3 text-desk-ink/50">
          Data stewardship: {STEWARDSHIP.dataSteward}, {PARTNER.founderTitle} · {PARTNER.name}
        </p>
        <p className="mx-auto mt-4 max-w-xl text-[0.7rem] leading-5 text-desk-ink/40">
          {STEWARDSHIP.formalStatement}
        </p>
        <p className="mt-4 text-desk-ink/45">
          {ORG.fullName}
          {ORG.web ? (
            <>
              {" · "}
              <a
                href={ORG.web}
                className="underline decoration-desk-line underline-offset-2 hover:text-desk-green"
                target="_blank"
                rel="noopener noreferrer"
              >
                iseyc.com.ng
              </a>
            </>
          ) : null}
        </p>
      </div>
    </footer>
  );
}

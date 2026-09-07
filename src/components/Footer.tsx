import { ORG } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-desk-line bg-white">
      <div className="mx-auto max-w-2xl px-4 py-6 text-center text-xs text-desk-ink/60">
        <p>
          Powered by {ORG.name} · {ORG.fullName}
        </p>
        <p className="mt-1">Records held for programme integrity and recognition · Not a medical record</p>
      </div>
    </footer>
  );
}

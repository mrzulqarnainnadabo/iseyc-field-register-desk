import { ReactNode } from "react";

export function Field({
  label,
  htmlFor,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        {htmlFor ? (
          <label htmlFor={htmlFor} className="text-sm font-bold leading-5 text-desk-ink">
            {label}
            {required && <span className="text-desk-green"> *</span>}
          </label>
        ) : (
          <span className="text-sm font-bold leading-5 text-desk-ink">
            {label}
            {required && <span className="text-desk-green"> *</span>}
          </span>
        )}
        {hint && !error && (
          <span className="shrink-0 text-[0.68rem] font-medium text-desk-ink/45">{hint}</span>
        )}
      </div>
      {children}
      {error && (
        <p className="text-xs font-semibold leading-4 text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

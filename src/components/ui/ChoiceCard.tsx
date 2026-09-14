"use client";

/** Large touch-friendly choice cards for field workers */
export function ChoiceCard({
  label,
  description,
  selected,
  onSelect,
}: {
  label: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`tap-target flex w-full items-start gap-3 rounded-2xl border px-4 py-3.5 text-left transition ${
        selected
          ? "border-desk-green bg-desk-green/10 shadow-sm"
          : "border-desk-line bg-white hover:border-desk-ink/20 hover:bg-desk-paper/40"
      }`}
    >
      <span
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-black ${
          selected
            ? "border-desk-green bg-desk-green text-white"
            : "border-desk-ink/25 text-transparent"
        }`}
        aria-hidden
      >
        ✓
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-desk-ink">{label}</span>
        {description ? (
          <span className="mt-0.5 block text-xs leading-4 text-desk-ink/55">{description}</span>
        ) : null}
      </span>
    </button>
  );
}

export function ChoiceGrid({
  options,
  value,
  onChange,
  multi = false,
}: {
  options: readonly string[] | { label: string; description?: string }[];
  value: string | string[];
  onChange: (v: string | string[]) => void;
  multi?: boolean;
}) {
  const selected = Array.isArray(value) ? value : value ? [value] : [];

  function toggle(label: string) {
    if (multi) {
      if (selected.includes(label)) {
        onChange(selected.filter((v) => v !== label));
      } else {
        onChange([...selected, label]);
      }
    } else {
      onChange(label);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {options.map((opt) => {
        const label = typeof opt === "string" ? opt : opt.label;
        const description = typeof opt === "string" ? undefined : opt.description;
        return (
          <ChoiceCard
            key={label}
            label={label}
            description={description}
            selected={selected.includes(label)}
            onSelect={() => toggle(label)}
          />
        );
      })}
    </div>
  );
}

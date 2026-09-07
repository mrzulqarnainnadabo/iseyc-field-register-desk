"use client";

export type TabKey = "rsvp" | "participation";

export function Tabs({
  active,
  onChange,
}: {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}) {
  const tabs: { key: TabKey; label: string }[] = [
    { key: "rsvp", label: "Anniversary RSVP" },
    { key: "participation", label: "Field participation" },
  ];

  return (
    <div className="flex rounded-lg border border-desk-line bg-white p-1">
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={`tap-target flex-1 rounded-md px-3 text-sm font-semibold transition ${
              isActive ? "bg-desk-green text-white" : "text-desk-ink/70 hover:text-desk-ink"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

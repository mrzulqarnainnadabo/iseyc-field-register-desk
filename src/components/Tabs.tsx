"use client";

export type TabKey = "rsvp" | "participation";

export function Tabs({ active, onChange }: { active: TabKey; onChange: (tab: TabKey) => void }) {
  const tabs: { key: TabKey; label: string }[] = [
    { key: "rsvp", label: "Anniversary RSVP" },
    { key: "participation", label: "Field participation" },
  ];
  return (
    <div className="grid grid-cols-2 rounded-xl border border-desk-line bg-white p-1.5 shadow-sm">
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        return <button key={tab.key} type="button" onClick={() => onChange(tab.key)} className={`tap-target rounded-lg px-3 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-desk-green/40 ${isActive ? "bg-desk-green text-white shadow-sm" : "text-desk-ink/65 hover:bg-desk-paper hover:text-desk-ink"}`}>{tab.label}</button>;
      })}
    </div>
  );
}

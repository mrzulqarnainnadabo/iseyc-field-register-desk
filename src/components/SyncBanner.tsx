"use client";

/** Offline / Syncing / Synced status strip for field conditions */
export function SyncBanner({
  status,
  pendingCount = 0,
}: {
  status: "online" | "offline" | "syncing" | "synced";
  pendingCount?: number;
}) {
  if (status === "online") return null;

  const config = {
    offline: {
      bg: "bg-amber-50 border-amber-200",
      text: "text-amber-950",
      label:
        pendingCount > 0
          ? `Offline — ${pendingCount} response${pendingCount === 1 ? "" : "s"} safely stored on this device`
          : "Offline — responses will be saved on this device",
    },
    syncing: {
      bg: "bg-desk-green/10 border-desk-green/25",
      text: "text-desk-green",
      label:
        pendingCount > 0
          ? `Syncing… ${pendingCount} remaining`
          : "Syncing responses…",
    },
    synced: {
      bg: "bg-desk-green/10 border-desk-green/25",
      text: "text-desk-green",
      label: "All responses synced",
    },
  }[status];

  return (
    <div
      role="status"
      className={`rounded-xl border px-3.5 py-2.5 text-center text-xs font-semibold ${config.bg} ${config.text}`}
    >
      {config.label}
    </div>
  );
}

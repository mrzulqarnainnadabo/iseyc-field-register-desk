/**
 * Offline response queue — localStorage with explicit persistence failure.
 */

export type QueuedResponse = {
  id: string;
  payload: Record<string, unknown>;
  createdAt: string;
  attempts: number;
};

const STORAGE_KEY = "iseyc_outreach_queue_v1";

function readQueue(): QueuedResponse[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeQueue(items: QueuedResponse[]): void {
  if (typeof window === "undefined") {
    throw new Error("Storage unavailable");
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    throw new Error("Could not save on this device. Storage may be full or blocked.");
  }
}

export function getPendingCount(): number {
  return readQueue().length;
}

export function enqueueResponse(payload: Record<string, unknown>): QueuedResponse {
  const item: QueuedResponse = {
    id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    payload,
    createdAt: new Date().toISOString(),
    attempts: 0,
  };
  const queue = readQueue();
  queue.push(item);
  writeQueue(queue); // throws on failure — caller must handle
  return item;
}

export function removeFromQueue(id: string) {
  writeQueue(readQueue().filter((item) => item.id !== id));
}

export type SyncResult = {
  synced: number;
  failed: number;
  remaining: number;
};

export async function flushQueue(): Promise<SyncResult> {
  const queue = readQueue();
  if (queue.length === 0) {
    return { synced: 0, failed: 0, remaining: 0 };
  }

  let synced = 0;
  let failed = 0;
  const remaining: QueuedResponse[] = [];

  for (const item of queue) {
    try {
      const res = await fetch("/api/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item.payload),
      });

      if (res.ok || res.status === 409) {
        synced += 1;
      } else {
        failed += 1;
        remaining.push({ ...item, attempts: item.attempts + 1 });
      }
    } catch {
      failed += 1;
      remaining.push({ ...item, attempts: item.attempts + 1 });
    }
  }

  try {
    writeQueue(remaining);
  } catch {
    // Keep in-memory attempt; next load may re-read old queue
  }
  return { synced, failed, remaining: remaining.length };
}

export function isOnline(): boolean {
  if (typeof navigator === "undefined") return true;
  return navigator.onLine;
}

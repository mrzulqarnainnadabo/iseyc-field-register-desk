"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { flushQueue, getPendingCount, isOnline } from "@/lib/offlineQueue";
import { SyncBanner } from "@/components/SyncBanner";

type SyncStatus = "online" | "offline" | "syncing" | "synced";

type OfflineContextValue = {
  status: SyncStatus;
  pendingCount: number;
  refreshPending: () => void;
  triggerSync: () => Promise<void>;
};

const OfflineContext = createContext<OfflineContextValue>({
  status: "online",
  pendingCount: 0,
  refreshPending: () => {},
  triggerSync: async () => {},
});

export function useOffline() {
  return useContext(OfflineContext);
}

export function OfflineProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<SyncStatus>("online");
  const [pendingCount, setPendingCount] = useState(0);
  const [showSynced, setShowSynced] = useState(false);

  const refreshPending = useCallback(() => {
    setPendingCount(getPendingCount());
  }, []);

  const triggerSync = useCallback(async () => {
    if (!isOnline()) {
      setStatus("offline");
      refreshPending();
      return;
    }

    const pending = getPendingCount();
    if (pending === 0) {
      setStatus("online");
      return;
    }

    setStatus("syncing");
    setPendingCount(pending);

    const result = await flushQueue();
    setPendingCount(result.remaining);

    if (result.remaining === 0 && result.synced > 0) {
      setStatus("synced");
      setShowSynced(true);
      setTimeout(() => {
        setShowSynced(false);
        setStatus(isOnline() ? "online" : "offline");
      }, 2500);
    } else if (result.remaining > 0) {
      setStatus(isOnline() ? "online" : "offline");
    } else {
      setStatus("online");
    }
  }, [refreshPending]);

  useEffect(() => {
    refreshPending();

    function onOnline() {
      void triggerSync();
    }
    function onOffline() {
      setStatus("offline");
      refreshPending();
    }

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    // Initial state
    if (!isOnline()) {
      setStatus("offline");
    } else if (getPendingCount() > 0) {
      void triggerSync();
    }

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, [refreshPending, triggerSync]);

  const displayStatus: SyncStatus =
    showSynced ? "synced" : status === "online" && pendingCount > 0 ? "offline" : status;

  // Show banner when offline, syncing, or briefly after sync
  const showBanner =
    displayStatus === "offline" ||
    displayStatus === "syncing" ||
    displayStatus === "synced" ||
    pendingCount > 0;

  return (
    <OfflineContext.Provider
      value={{ status: displayStatus, pendingCount, refreshPending, triggerSync }}
    >
      {showBanner && (
        <div className="mb-3">
          <SyncBanner
            status={pendingCount > 0 && displayStatus === "online" ? "offline" : displayStatus}
            pendingCount={pendingCount}
          />
        </div>
      )}
      {children}
    </OfflineContext.Provider>
  );
}

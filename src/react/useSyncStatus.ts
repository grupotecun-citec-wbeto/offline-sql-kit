import { useEffect, useState } from "react";
import type { SyncEngine, SyncStatus } from "../sync/SyncEngine";

/**
 * Hook para observar el estado del SyncEngine.
 */
export function useSyncStatus(engine?: SyncEngine | null) {
  const [status, setStatus] = useState<SyncStatus>("idle");

  useEffect(() => {
    if (!engine) return;
    setStatus(engine.getStatus());
    const unsub = engine.subscribe(setStatus);
    return unsub;
  }, [engine]);

  return status;
}
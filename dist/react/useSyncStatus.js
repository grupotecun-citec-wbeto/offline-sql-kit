import { useEffect, useState } from "react";
/**
 * Hook para observar el estado del SyncEngine.
 */
export function useSyncStatus(engine) {
    const [status, setStatus] = useState("idle");
    useEffect(() => {
        if (!engine)
            return;
        setStatus(engine.getStatus());
        const unsub = engine.subscribe(setStatus);
        return unsub;
    }, [engine]);
    return status;
}

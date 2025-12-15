import type { SyncEngine, SyncStatus } from "../sync/SyncEngine";
/**
 * Hook para observar el estado del SyncEngine.
 */
export declare function useSyncStatus(engine?: SyncEngine | null): SyncStatus;

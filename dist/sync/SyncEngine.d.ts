import type { SyncAdapter } from "./SyncAdapter";
import type { SyncPersister } from "./types";
export type SyncStatus = "idle" | "syncing" | "error";
/**
 * Orquestador de sincronización offline-first.
 *
 * No sabe de Drizzle ni de SQLite directamente:
 * habla con un SyncAdapter (API) y un SyncPersister (BD local).
 */
export declare class SyncEngine {
    private adapter;
    private persister;
    private status;
    private emitter;
    constructor(adapter: SyncAdapter, persister: SyncPersister);
    getStatus(): SyncStatus;
    private setStatus;
    /**
     * Permite suscribirse a cambios de estado (idle/syncing/error).
     */
    subscribe(listener: (s: SyncStatus) => void): () => void;
    /**
     * Ejecuta un ciclo de sincronización completo:
     * 1) lee último token
     * 2) recolecta cambios locales
     * 3) hace push al servidor
     * 4) hace pull desde el servidor
     * 5) aplica cambios remotos
     * 6) actualiza token
     * 7) notifica tablas cambiadas
     */
    syncOnce(): Promise<void>;
}

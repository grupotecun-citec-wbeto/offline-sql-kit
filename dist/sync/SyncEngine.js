import EventEmitter from "eventemitter3";
import { notifyDbChanged } from "../core/events/DbEventBus";
/**
 * Orquestador de sincronización offline-first.
 *
 * No sabe de Drizzle ni de SQLite directamente:
 * habla con un SyncAdapter (API) y un SyncPersister (BD local).
 */
export class SyncEngine {
    constructor(adapter, persister) {
        this.adapter = adapter;
        this.persister = persister;
        this.status = "idle";
        this.emitter = new EventEmitter();
    }
    getStatus() {
        return this.status;
    }
    setStatus(status) {
        this.status = status;
        this.emitter.emit("status", status);
    }
    /**
     * Permite suscribirse a cambios de estado (idle/syncing/error).
     */
    subscribe(listener) {
        this.emitter.on("status", listener);
        return () => this.emitter.off("status", listener);
    }
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
    async syncOnce() {
        try {
            this.setStatus("syncing");
            const lastToken = await this.persister.getLastSyncToken();
            const localChanges = await this.persister.collectLocalChanges(lastToken);
            await this.adapter.push(localChanges);
            const remote = await this.adapter.pull(lastToken);
            await this.persister.applyRemoteChanges(remote.tables);
            await this.persister.setLastSyncToken(remote.lastSyncToken);
            const changedTables = Object.keys(remote.tables);
            if (changedTables.length > 0) {
                notifyDbChanged(changedTables);
            }
            this.setStatus("idle");
        }
        catch (error) {
            this.setStatus("error");
            throw error;
        }
    }
}

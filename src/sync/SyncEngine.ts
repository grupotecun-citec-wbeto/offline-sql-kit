import EventEmitter from "eventemitter3";
import { notifyDbChanged } from "../core/events/DbEventBus";
import type { SyncAdapter } from "./SyncAdapter";
import type { SyncPersister } from "./types";

export type SyncStatus = "idle" | "syncing" | "error";

/**
 * Orquestador de sincronización offline-first.
 *
 * No sabe de Drizzle ni de SQLite directamente:
 * habla con un SyncAdapter (API) y un SyncPersister (BD local).
 */
export class SyncEngine {
  private status: SyncStatus = "idle";
  private emitter = new EventEmitter();

  constructor(
    private adapter: SyncAdapter,
    private persister: SyncPersister
  ) {}

  getStatus(): SyncStatus {
    return this.status;
  }

  private setStatus(status: SyncStatus) {
    this.status = status;
    this.emitter.emit("status", status);
  }

  /**
   * Permite suscribirse a cambios de estado (idle/syncing/error).
   */
  subscribe(listener: (s: SyncStatus) => void): () => void {
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
  async syncOnce(): Promise<void> {
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
    } catch (error) {
      this.setStatus("error");
      throw error;
    }
  }
}
/**
 * Cambios por tabla: { nombreTabla: filas[] }
 */
export type TableChanges = Record<string, any[]>;
/**
 * Resultado estándar de un pull remoto.
 */
export interface SyncResult {
    tables: TableChanges;
    lastSyncToken: any;
}
/**
 * Contrato que tu capa de persistencia local debe implementar
 * (normalmente usando Drizzle + SQLite).
 */
export interface SyncPersister {
    getLastSyncToken(): Promise<any | null>;
    setLastSyncToken(token: any): Promise<void>;
    collectLocalChanges(since: any | null): Promise<TableChanges>;
    applyRemoteChanges(tables: TableChanges): Promise<void>;
}

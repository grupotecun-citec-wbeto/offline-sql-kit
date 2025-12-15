import type { TableChanges, SyncResult } from "./types";

/**
 * Adaptador que habla con tu API (REST, GraphQL, etc.)
 */
export interface SyncAdapter {
  pull(since: any | null): Promise<SyncResult>;
  push(changes: TableChanges): Promise<void>;
}
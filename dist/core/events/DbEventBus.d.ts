/**
 * Notifica que ciertas tablas han cambiado.
 * Llama esto en tus repositorios después de insertar/actualizar/eliminar.
 */
export declare function notifyDbChanged(tables: string[]): void;
/**
 * Se suscribe a cambios en una o varias tablas.
 * Usado internamente por useLiveQuery.
 */
export declare function subscribeDbChanges(tables: string[], listener: () => void): () => void;

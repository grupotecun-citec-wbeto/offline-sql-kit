import EventEmitter from "eventemitter3";

const emitter = new EventEmitter();

/**
 * Notifica que ciertas tablas han cambiado.
 * Llama esto en tus repositorios después de insertar/actualizar/eliminar.
 */
export function notifyDbChanged(tables: string[]) {
  emitter.emit("db-changed", tables);
}

/**
 * Se suscribe a cambios en una o varias tablas.
 * Usado internamente por useLiveQuery.
 */
export function subscribeDbChanges(
  tables: string[],
  listener: () => void
): () => void {
  const handler = (changed: string[]) => {
    if (changed.some(t => tables.includes(t))) {
      listener();
    }
  };
  emitter.on("db-changed", handler);
  return () => emitter.off("db-changed", handler);
}
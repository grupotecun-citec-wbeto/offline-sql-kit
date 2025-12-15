/**
 * Hook para ejecutar una consulta y volver a dispararla cada vez
 * que cambien las tablas indicadas.
 *
 * @param tables Tablas a observar (ej: ["casos", "visitas"])
 * @param queryFn Función que ejecuta la consulta (puede usar Drizzle)
 * @param deps Dependencias adicionales (ej: filtros, página, etc.)
 */
export declare function useLiveQuery<T>(tables: string[], queryFn: () => Promise<T> | T, deps?: any[]): T | null;

import { useEffect, useState } from "react";
import { subscribeDbChanges } from "../core/events/DbEventBus";
/**
 * Hook para ejecutar una consulta y volver a dispararla cada vez
 * que cambien las tablas indicadas.
 *
 * @param tables Tablas a observar (ej: ["casos", "visitas"])
 * @param queryFn Función que ejecuta la consulta (puede usar Drizzle)
 * @param deps Dependencias adicionales (ej: filtros, página, etc.)
 */
export function useLiveQuery(tables, queryFn, deps = []) {
    const [data, setData] = useState(null);
    async function load() {
        const result = await queryFn();
        setData(result);
    }
    useEffect(() => {
        load();
        const unsub = subscribeDbChanges(tables, load);
        return unsub;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
    return data;
}

import SQLite from "react-native-sqlite-storage";
import { drizzle } from "drizzle-orm/sqlite-proxy";
/**
 * Crea una conexión SQLite usando react-native-sqlite-storage
 * y la envuelve con Drizzle ORM.
 *
 * En tu app puedes hacer:
 *
 *   const { db, native } = await createSQLiteConnection("miapp.db");
 */
export async function createSQLiteConnection(name = "app.db") {
    const native = await SQLite.openDatabase({ name, location: "default" });
    const driver = {
        async run(sql, params = []) {
            return new Promise((resolve, reject) => {
                native.readTransaction((tx) => {
                    tx.executeSql(sql, params, (_, res) => resolve(res), (_, err) => reject(err));
                });
            });
        },
    };
    const db = drizzle(driver);
    return { db, native };
}

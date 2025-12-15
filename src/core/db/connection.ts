import SQLite, { SQLiteDatabase, Transaction, ResultSet, SQLError } from "react-native-sqlite-storage";
import { drizzle } from "drizzle-orm/sqlite-proxy";

/**
 * Crea una conexión SQLite usando react-native-sqlite-storage
 * y la envuelve con Drizzle ORM.
 *
 * En tu app puedes hacer:
 *
 *   const { db, native } = await createSQLiteConnection("miapp.db");
 */
export async function createSQLiteConnection(name: string = "app.db") {
  const native: SQLiteDatabase = await SQLite.openDatabase({ name, location: "default" });

  const driver: any = {
    async run(sql: string, params: any[] = []): Promise<ResultSet> {
      return new Promise((resolve, reject) => {
        native.readTransaction((tx: Transaction) => {
          tx.executeSql(
            sql,
            params,
            (_: Transaction, res: ResultSet) => resolve(res),
            (_: Transaction, err: SQLError) => reject(err)
          );
        });
      });
    },
  };

  const db: any = drizzle(driver);
  return { db, native };
}
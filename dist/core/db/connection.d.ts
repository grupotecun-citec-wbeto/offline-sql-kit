import SQLite from "react-native-sqlite-storage";
/**
 * Crea una conexión SQLite usando react-native-sqlite-storage
 * y la envuelve con Drizzle ORM.
 *
 * En tu app puedes hacer:
 *
 *   const { db, native } = await createSQLiteConnection("miapp.db");
 */
export declare function createSQLiteConnection(name?: string): Promise<{
    db: any;
    native: SQLite.SQLiteDatabase;
}>;

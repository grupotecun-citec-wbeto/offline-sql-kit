# @hherrador1/offline-sql-kit

Paquete offline-first para **React Native** que combina:

- ⚡ SQLite (`react-native-sqlite-storage`)
- 🧱 Drizzle ORM (joins, tipos, migraciones)
- 🔁 Capa de sincronización genérica (push/pull)
- 👀 Live queries al estilo Realm

## Instalación

```bash
npm install @hherrador1/offline-sql-kit
# o
yarn add @hherrador1/offline-sql-kit
```

## Guía de Uso

### 1. Configuración de la Base de Datos

Defines tu esquema con Drizzle y creas la conexión.

```typescript
// schema.ts
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const tasks = sqliteTable("tasks", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  isCompleted: integer("is_completed", { mode: "boolean" }).default(false),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

// db.ts
import { createSQLiteConnection } from "@hherrador1/offline-sql-kit";
import * as schema from "./schema";

export const initDB = async () => {
  const { db, native } = await createSQLiteConnection("mi_app.db");
  return { db, native };
};
```

### 2. Implementación de la Sincronización

Implementa `SyncAdapter` (API) y `SyncPersister` (BD Local).

```typescript
// sync/MyApiAdapter.ts
import type { SyncAdapter, SyncResult, TableChanges } from "@hherrador1/offline-sql-kit";

export class MyApiAdapter implements SyncAdapter {
  async pull(since: any | null): Promise<SyncResult> {
    // Llama a tu endpoint de backend para traer cambios
    const response = await fetch(`https://api.miapp.com/sync?since=${since || 0}`);
    const data = await response.json();
    return {
      tables: data.changes, 
      lastSyncToken: data.newToken,
    };
  }

  async push(changes: TableChanges): Promise<void> {
    // Envía los cambios locales al servidor
    await fetch("https://api.miapp.com/sync/push", {
      method: "POST",
      body: JSON.stringify(changes),
    });
  }
}

// sync/MyLocalPersister.ts
import type { SyncPersister, TableChanges } from "@hherrador1/offline-sql-kit";
import { tasks } from "../schema";
import { gt } from "drizzle-orm";

export class MyLocalPersister implements SyncPersister {
  constructor(private db: any) {}

  async getLastSyncToken() { 
    // Recupera el token guardado (ej: de una tabla 'meta')
    return 0; 
  }
  
  async setLastSyncToken(token: any) { 
    // Guarda el nuevo token
  }

  async collectLocalChanges(since: any | null): Promise<TableChanges> {
    // Busca registros modificados localmente
    const changedTasks = await this.db.select().from(tasks).where(gt(tasks.updatedAt, since));
    return { tasks: changedTasks };
  }

  async applyRemoteChanges(changes: TableChanges): Promise<void> {
    // Inserta o actualiza los datos que vienen del servidor
    if (changes.tasks) {
      for (const task of changes.tasks) {
        await this.db.insert(tasks).values(task).onConflictDoUpdate({ target: tasks.id, set: task });
      }
    }
  }
}
```

### 3. Inicializar SyncEngine

```typescript
import { SyncEngine } from "@hherrador1/offline-sql-kit";
import { MyApiAdapter } from "./sync/MyApiAdapter";
import { MyLocalPersister } from "./sync/MyLocalPersister";

// Asumiendo que ya tienes 'db' inicializada
const adapter = new MyApiAdapter();
const persister = new MyLocalPersister(db); 

export const syncEngine = new SyncEngine(adapter, persister);

// Iniciar sincronización
syncEngine.start();
```

### 4. React Live Queries

Usa `useLiveQuery` para que tu UI se actualice automáticamente cuando cambian los datos.

```typescript
import { Text, FlatList } from "react-native";
import { useLiveQuery } from "@hherrador1/offline-sql-kit";
import { tasks } from "./schema";
import { db } from "./db"; 

export const TaskList = () => {
  const taskList = useLiveQuery(
    ["tasks"], // 1. Tablas a observar
    async () => {
      // 2. Función de consulta
      return await db.select().from(tasks);
    },
    [] // 3. Dependencias
  );

  if (!taskList) return <Text>Cargando...</Text>;

  return (
    <FlatList
      data={taskList}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <Text>{item.title}</Text>}
    />
  );
};
```
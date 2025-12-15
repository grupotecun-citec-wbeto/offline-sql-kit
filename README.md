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

## Uso rápido

```ts
import {
  createSQLiteConnection,
  useLiveQuery,
  useSyncStatus,
  SyncEngine,
  SyncAdapter,
} from "@hherrador1/offline-sql-kit";

import type { SyncPersister, TableChanges, SyncResult } from "@hherrador1/offline-sql-kit";
```

Luego defines tu esquema con Drizzle, implementas tu `SyncAdapter` y tu `SyncPersister`
en tu app, y usas `SyncEngine` para orquestar el sync y `useLiveQuery`
para mantener la UI reactiva.
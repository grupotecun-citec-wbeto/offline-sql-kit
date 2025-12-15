import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
/**
 * Ejemplo de esquema para tus tablas principales.
 * Reemplaza/ajusta según tu dominio real.
 */
export const casos = sqliteTable("casos", {
    id: text("id").primaryKey(),
    nombre: text("nombre").notNull(),
    createdAt: integer("created_at", { mode: "number" }).notNull(),
    updatedAt: integer("updated_at", { mode: "number" }).notNull(),
});
export const visitas = sqliteTable("visitas", {
    id: text("id").primaryKey(),
    casoId: text("caso_id")
        .notNull()
        .references(() => casos.id),
    fecha: integer("fecha", { mode: "number" }).notNull(),
    createdAt: integer("created_at", { mode: "number" }).notNull(),
    updatedAt: integer("updated_at", { mode: "number" }).notNull(),
});
export const elementos = sqliteTable("elementos", {
    id: text("id").primaryKey(),
    visitaId: text("visita_id")
        .notNull()
        .references(() => visitas.id),
    tipo: text("tipo").notNull(),
    estado: text("estado").notNull(),
    createdAt: integer("created_at", { mode: "number" }).notNull(),
    updatedAt: integer("updated_at", { mode: "number" }).notNull(),
});

import {
  foreignKey,
  integer,
  pgTable,
  serial,
  text,
  unique,
  varchar,
} from "drizzle-orm/pg-core";

export const testTable = pgTable("tests", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
});

export const opd = pgTable("opd", {
  id: serial("id").primaryKey(),
  nama: text().notNull(),
  singkatan: text().notNull(),
});

export const kenaikan_pangkat = pgTable(
  "kenaikan_pangkat",
  {
    id: serial("id").primaryKey(),
    tahun: integer().notNull(),
    bulan: text().notNull(),
    id_opd: integer().notNull(),
    berhasil: integer().notNull().default(0),
    tidak_berhasil: integer().notNull().default(0),
  },
  (table) => [
    foreignKey({
      columns: [table.id_opd],
      foreignColumns: [opd.id],
    }),
    unique().on(table.tahun, table.bulan, table.id_opd),
  ]
);

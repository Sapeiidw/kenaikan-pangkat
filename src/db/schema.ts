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
    value: integer().notNull().default(0),
  },
  (table) => [
    foreignKey({
      columns: [table.id_opd],
      foreignColumns: [opd.id],
    }),
    unique().on(table.tahun, table.bulan, table.id_opd),
  ]
);

export const status_dokumen = pgTable(
  "status_dokumen",
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

export const status_kenaikan_pangkat = pgTable(
  "status_kenaikan_pangkat",
  {
    id: serial("id").primaryKey(),
    tahun: integer().notNull(),
    bulan: text().notNull(),
    id_opd: integer().notNull(),
    input_berkas: integer().notNull().default(0),
    berkas_disimpan: integer().notNull().default(0),
    bts: integer().notNull().default(0),
    sudah_ttd_pertek: integer().notNull().default(0),
  },
  (table) => [
    foreignKey({
      columns: [table.id_opd],
      foreignColumns: [opd.id],
    }),
    unique().on(table.tahun, table.bulan, table.id_opd),
  ]
);

export const dokumen_terverifikasi = pgTable(
  "dokumen_terverifikasi",
  {
    id: serial("id").primaryKey(),
    tahun: integer().notNull(),
    bulan: text().notNull(),
    id_opd: integer().notNull(),
    terverifikasi: integer().notNull().default(0),
    tidak_terverifikasi: integer().notNull().default(0),
  },
  (table) => [
    foreignKey({
      columns: [table.id_opd],
      foreignColumns: [opd.id],
    }),
    unique().on(table.tahun, table.bulan, table.id_opd),
  ]
);

export const status_sk_kenaikan_pangkat = pgTable(
  "status_sk_kenaikan_pangkat",
  {
    id: serial("id").primaryKey(),
    tahun: integer().notNull(),
    bulan: text().notNull(),
    id_opd: integer().notNull(),
    sudah_ttd_pertek: integer().notNull().default(0),
    belum_ttd_pertek: integer().notNull().default(0),
  },
  (table) => [
    foreignKey({
      columns: [table.id_opd],
      foreignColumns: [opd.id],
    }),
    unique().on(table.tahun, table.bulan, table.id_opd),
  ]
);

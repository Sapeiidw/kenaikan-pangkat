import { integer, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import z4 from "zod/v4";

export const testTable = pgTable("tests", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
});

export const dokumenNaikPangkat = pgTable("dokumen_naik_pangkat", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  tahun: integer().notNull(),
  berhasil: integer().notNull(),
  tidak_memenuhi_syarat: integer().notNull(),
});

export const dokumenNaikPangkatSchema = createInsertSchema(dokumenNaikPangkat);

export const dokumenNaikPangkatDetail = pgTable("dokumen_naik_pangkat_detail", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  id_kenaikan_pangkat: integer()
    .notNull()
    .references(() => dokumenNaikPangkat.id),
  bulan: text().notNull(),
  berhasil: integer().notNull(),
  tidak_memenuhi_syarat: integer().notNull(),
});

export const dokumenNaikPangkatDetailSchema = createInsertSchema(
  dokumenNaikPangkatDetail
).extend({
  berhasil: z4.coerce.number<number>(),
  tidak_memenuhi_syarat: z4.coerce.number<number>(),
});

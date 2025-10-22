import { status_dokumen_wajib, opd } from "@/db/schema";
import { db } from "@/lib/db";
import { and, eq, getTableColumns, SQL, sql } from "drizzle-orm";

export async function GET(req: Request) {
  // Construct a URL instance from the request
  const { searchParams } = new URL(req.url);

  const forParam = searchParams.get("for");
  const id_opd = searchParams.get("id_opd");
  const year = searchParams.get("year");

  const conditions: SQL[] = [];

  if (id_opd) conditions.push(eq(status_dokumen_wajib.id_opd, Number(id_opd)));
  if (year) conditions.push(eq(sql<number>`extract(year from periode)`, year));

  if (forParam === "dashboard") {
    const data = await db
      .select({
        label: sql<string>`TRIM(TO_CHAR(periode, 'Month'))`.as("label"),
        berhasil: sql<number>`SUM(status_dokumen_wajib.berhasil)`.as(
          "berhasil"
        ),
        tidak_berhasil:
          sql<number>`SUM(status_dokumen_wajib.tidak_berhasil)`.as(
            "tidak_berhasil"
          ),
      })
      .from(status_dokumen_wajib)
      .where(and(...conditions))
      .groupBy(status_dokumen_wajib.periode)
      .orderBy(status_dokumen_wajib.periode);

    return Response.json(data);
  }

  const data = await db
    .select({
      ...getTableColumns(status_dokumen_wajib),
      nama_opd: opd.nama,
      tahun: sql<number>`extract(year from periode)`,
      bulan: sql<number>`extract(month from periode)`,
    })
    .from(status_dokumen_wajib)
    .leftJoin(opd, eq(status_dokumen_wajib.id_opd, opd.id))
    .where(and(...conditions))
    .orderBy(status_dokumen_wajib.id);

  return Response.json(data);
}

export async function POST(req: Request) {
  try {
    const { id, ...body } = await req.json();

    const data = await db.transaction(async (tx) => {
      const [result] = await tx
        .insert(status_dokumen_wajib)
        .values({
          ...body,
          periode: new Date(`${body.tahun}-${body.bulan}-01`),
        })
        .returning();
      return result;
    });

    return Response.json(data);
  } catch (error) {
    return Response.json(
      {
        message: "Gagal menyimpan data",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

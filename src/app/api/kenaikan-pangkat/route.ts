import { kenaikan_pangkat, opd } from "@/db/schema";
import { db } from "@/lib/db";
import { and, eq, getTableColumns, SQL, sql } from "drizzle-orm";

export async function GET(req: Request) {
  // Construct a URL instance from the request
  const { searchParams } = new URL(req.url);

  const forParam = searchParams.get("for");
  const id_opd = searchParams.get("id_opd");
  const year = searchParams.get("year");

  const conditions: SQL[] = [];

  if (id_opd) conditions.push(eq(kenaikan_pangkat.id_opd, Number(id_opd)));
  if (year) conditions.push(eq(sql<number>`extract(year from periode)`, year));

  if (forParam === "dashboard") {
    const data = await db
      .select({
        label: sql<string>`TRIM(TO_CHAR(periode, 'Month'))`.as("label"),
        value: sql<number>`SUM(kenaikan_pangkat.value)`.as("value"),
      })
      .from(kenaikan_pangkat)
      .where(and(...conditions))
      .groupBy(kenaikan_pangkat.periode)
      .orderBy(kenaikan_pangkat.periode);

    return Response.json(data);
  }

  const data = await db
    .select({
      ...getTableColumns(kenaikan_pangkat),
      nama_opd: opd.nama,
      tahun: sql<number>`extract(year from periode)`,
      bulan: sql<number>`extract(month from periode)`,
    })
    .from(kenaikan_pangkat)
    .leftJoin(opd, eq(kenaikan_pangkat.id_opd, opd.id))
    .where(and(...conditions))
    .orderBy(kenaikan_pangkat.id);

  return Response.json(data);
}

export async function POST(req: Request) {
  try {
    const { id, ...body } = await req.json();

    const data = await db.transaction(async (tx) => {
      const [result] = await tx
        .insert(kenaikan_pangkat)
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

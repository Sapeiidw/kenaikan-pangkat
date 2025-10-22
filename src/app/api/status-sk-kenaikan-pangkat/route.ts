import { status_sk_kenaikan_pangkat, opd } from "@/db/schema";
import { db } from "@/lib/db";
import { and, eq, getTableColumns, SQL, sql } from "drizzle-orm";

export async function GET(req: Request) {
  // Construct a URL instance from the request
  const { searchParams } = new URL(req.url);

  const forParam = searchParams.get("for");
  const id_opd = searchParams.get("id_opd");
  const year = searchParams.get("year");
  const month = searchParams.get("month");

  const conditions: SQL[] = [];

  if (id_opd)
    conditions.push(eq(status_sk_kenaikan_pangkat.id_opd, Number(id_opd)));
  if (year && month)
    conditions.push(
      eq(status_sk_kenaikan_pangkat.periode, `${year}-${month}-01`)
    );

  if (forParam === "dashboard") {
    const [dataStatusKenaikanPangkat] = await db
      .select()
      .from(status_sk_kenaikan_pangkat)
      .where(and(...conditions))
      .orderBy(status_sk_kenaikan_pangkat.periode);

    const data = dataStatusKenaikanPangkat
      ? [
          {
            label: "belum_ttd_pertek",
            value: dataStatusKenaikanPangkat.belum_ttd_pertek,
          },
          {
            label: "sudah_ttd_pertek",
            value: dataStatusKenaikanPangkat.sudah_ttd_pertek,
          },
        ]
      : [
          { label: "belum_ttd_pertek", value: 0 },
          { label: "sudah_ttd_pertek", value: 0 },
        ];
    return Response.json(data);
  }

  const data = await db
    .select({
      ...getTableColumns(status_sk_kenaikan_pangkat),
      nama_opd: opd.nama,
      tahun: sql<number>`extract(year from periode)`,
      bulan: sql<number>`extract(month from periode)`,
    })
    .from(status_sk_kenaikan_pangkat)
    .leftJoin(opd, eq(status_sk_kenaikan_pangkat.id_opd, opd.id))
    .orderBy(status_sk_kenaikan_pangkat.id);

  return Response.json(data);
}

export async function POST(req: Request) {
  try {
    const { id, ...body } = await req.json();

    const data = await db.transaction(async (tx) => {
      const [result] = await tx
        .insert(status_sk_kenaikan_pangkat)
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

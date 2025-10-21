import { status_kenaikan_pangkat, opd } from "@/db/schema";
import { db } from "@/lib/db";
import { eq, getTableColumns, sql } from "drizzle-orm";

export async function GET() {
  const data = await db
    .select({
      ...getTableColumns(status_kenaikan_pangkat),
      nama_opd: opd.nama,
      tahun: sql<number>`extract(year from periode)`,
      bulan: sql<number>`extract(month from periode)`,
    })
    .from(status_kenaikan_pangkat)
    .leftJoin(opd, eq(status_kenaikan_pangkat.id_opd, opd.id))
    .orderBy(status_kenaikan_pangkat.id);

  return Response.json(data);
}

export async function POST(req: Request) {
  try {
    const { id, ...body } = await req.json();

    const data = await db.transaction(async (tx) => {
      const [result] = await tx
        .insert(status_kenaikan_pangkat)
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

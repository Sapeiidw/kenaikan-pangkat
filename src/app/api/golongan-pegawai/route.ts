import { golongan_pegawai, opd } from "@/db/schema";
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

  if (id_opd) conditions.push(eq(golongan_pegawai.id_opd, Number(id_opd)));
  if (year && month)
    conditions.push(eq(golongan_pegawai.periode, `${year}-${month}-01`));

  if (forParam === "dashboard") {
    const [dataGolonganPegawai] = await db
      .select()
      .from(golongan_pegawai)
      .where(and(...conditions))
      .orderBy(golongan_pegawai.periode);

    const data = dataGolonganPegawai
      ? [
          { label: "Golongan I", value: dataGolonganPegawai.golongan_i },
          { label: "Golongan II", value: dataGolonganPegawai.golongan_ii },
          { label: "Golongan III", value: dataGolonganPegawai.golongan_iii },
          { label: "Golongan IV", value: dataGolonganPegawai.golongan_iv },
        ]
      : [];

    return Response.json(data);
  }

  const data = await db
    .select({
      ...getTableColumns(golongan_pegawai),
      nama_opd: opd.nama,
      tahun: sql<number>`extract(year from periode)`,
      bulan: sql<number>`extract(month from periode)`,
    })
    .from(golongan_pegawai)
    .leftJoin(opd, eq(golongan_pegawai.id_opd, opd.id))
    .orderBy(golongan_pegawai.id);

  return Response.json(data);
}

export async function POST(req: Request) {
  try {
    const { id, ...body } = await req.json();

    const data = await db.transaction(async (tx) => {
      const [result] = await tx
        .insert(golongan_pegawai)
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

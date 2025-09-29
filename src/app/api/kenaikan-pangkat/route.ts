import { kenaikan_pangkat, opd } from "@/db/schema";
import { db } from "@/lib/db";
import { eq, getTableColumns } from "drizzle-orm";

export async function GET() {
  const data = await db
    .select({
      ...getTableColumns(kenaikan_pangkat),
      nama_opd: opd.nama,
    })
    .from(kenaikan_pangkat)
    .leftJoin(opd, eq(kenaikan_pangkat.id_opd, opd.id))
    .orderBy(kenaikan_pangkat.id);

  return Response.json(data);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const data = await db.transaction(async (tx) => {
      const [result] = await tx
        .insert(kenaikan_pangkat)
        .values(body)
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

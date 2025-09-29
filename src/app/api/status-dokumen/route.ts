import { opd, status_dokumen } from "@/db/schema";
import { db } from "@/lib/db";
import { eq, getTableColumns } from "drizzle-orm";

export async function GET() {
  const data = await db
    .select({
      ...getTableColumns(status_dokumen),
      nama_opd: opd.nama,
    })
    .from(status_dokumen)
    .leftJoin(opd, eq(status_dokumen.id_opd, opd.id))
    .orderBy(status_dokumen.id);

  return Response.json(data);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const data = await db.transaction(async (tx) => {
      const [result] = await tx.insert(status_dokumen).values(body).returning();
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

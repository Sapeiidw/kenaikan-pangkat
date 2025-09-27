import { dokumenNaikPangkat, dokumenNaikPangkatDetail } from "@/db/schema";
import { db } from "@/lib/db";
import { eq, getTableColumns } from "drizzle-orm";
import type { NextRequest } from "next/server";

export async function GET(_req: NextRequest, ctx: { params: { id: string } }) {
  const { id } = await ctx.params;

  const data = await db
    .select({
      ...getTableColumns(dokumenNaikPangkatDetail),
      tahun: dokumenNaikPangkat.tahun,
    })
    .from(dokumenNaikPangkat)
    .innerJoin(
      dokumenNaikPangkatDetail,
      eq(dokumenNaikPangkat.id, dokumenNaikPangkatDetail.id_kenaikan_pangkat)
    )
    .where(eq(dokumenNaikPangkat.id, +id));
  return Response.json({
    data,
    message: "Success! Get Dokumen Kenaikan Pangkat",
  });
}

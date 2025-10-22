// /app/api/status-kenaikan-pangkat/[id]/route.ts
import { status_kenaikan_pangkat } from "@/db/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function PUT(
  req: NextRequest,
  ctx: RouteContext<"/api/status-kenaikan-pangkat/[id]">
) {
  const { id } = await ctx.params;
  const body = await req.json();

  const parsedId = parseInt(id);
  if (isNaN(parsedId)) {
    return new Response(JSON.stringify({ error: "Invalid ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const updated = await db
    .update(status_kenaikan_pangkat)
    .set({ ...body, periode: new Date(`${body.tahun}-${body.bulan}-01`) })
    .where(eq(status_kenaikan_pangkat.id, parsedId))
    .returning();

  if (updated.length === 0) {
    return new Response(JSON.stringify({ error: "Data not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ message: "Berhasil diperbarui" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE(
  req: NextRequest,
  ctx: RouteContext<"/api/status-kenaikan-pangkat/[id]">
) {
  try {
    const { id } = await ctx.params;

    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      return new Response(JSON.stringify({ error: "Invalid ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const deleted = await db
      .delete(status_kenaikan_pangkat)
      .where(eq(status_kenaikan_pangkat.id, parsedId))
      .returning();

    if (deleted.length === 0) {
      return new Response(JSON.stringify({ error: "Data not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ message: "Berhasil dihapus" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Delete Error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

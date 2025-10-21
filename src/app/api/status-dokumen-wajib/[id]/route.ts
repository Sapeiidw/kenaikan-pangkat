// /app/api/status-dokumen-wajib/[id]/route.ts
import { status_dokumen_wajib } from "@/db/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function PUT(
  req: NextRequest,
  ctx: RouteContext<"/api/status-dokumen-wajib/[id]">
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
    .update(status_dokumen_wajib)
    .set(body)
    .where(eq(status_dokumen_wajib.id, parsedId))
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
  ctx: RouteContext<"/api/status-dokumen-wajib/[id]">
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
      .delete(status_dokumen_wajib)
      .where(eq(status_dokumen_wajib.id, parsedId))
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

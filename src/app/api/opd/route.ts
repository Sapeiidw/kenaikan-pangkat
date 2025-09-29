import { opd } from "@/db/schema";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await db.select().from(opd).orderBy(opd.id);
  return NextResponse.json(data);
}

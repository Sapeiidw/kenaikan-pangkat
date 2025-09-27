// app/api/kenaikan-pangkat/route.ts
import {
  dokumenNaikPangkat,
  dokumenNaikPangkatDetail,
  dokumenNaikPangkatDetailSchema,
  dokumenNaikPangkatSchema,
} from "@/db/schema";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  return new Response(`Hello, Next.js! ${req.url}`);
}

export async function POST(req: Request) {
  const { detail, ...body } = await req.json();

  const data = await db.transaction(async (tx) => {
    const validate = dokumenNaikPangkatSchema.parse({
      ...body,
    });
    const [data] = await tx
      .insert(dokumenNaikPangkat)
      .values(validate)
      .returning();

    const validateDetail = detail.map((item: typeof dokumenNaikPangkatDetail) =>
      dokumenNaikPangkatDetailSchema.parse({
        ...item,
        id_kenaikan_pangkat: data.id,
      })
    );
    const dataDetail = await tx
      .insert(dokumenNaikPangkatDetail)
      .values(validateDetail);

    return { ...data, detail: dataDetail };
  });

  return NextResponse.json({
    data: data,
    message: "Success! Create Dokumen Kenaikan Pangkat",
  });
}

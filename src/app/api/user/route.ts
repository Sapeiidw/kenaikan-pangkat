import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const client = await clerkClient();

  const data = await client.users.getUserList();
  console.log(data);

  return NextResponse.json(data);
}

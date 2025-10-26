import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  ctx: RouteContext<"/api/user/[id]">
) {
  const { id } = await ctx.params;
  const body = await req.json();

  const client = await clerkClient();
  const data = await client.users.updateUser(id, {
    unsafeMetadata: {
      role: body.role,
    },
  });

  // Get the user's sessions
  const sessions = await client.sessions.getSessionList({ userId: id });

  // Revoke all sessions for this user
  for (const session of sessions.data) {
    await client.sessions.revokeSession(session.id);
  }

  return NextResponse.json(data);
}

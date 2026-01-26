import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "placeholder - implement WP posts fetch in TASK-016",
  });
}


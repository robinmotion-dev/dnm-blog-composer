import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    ok: true,
    message: "placeholder - implement WP draft creation in TASK-016",
  });
}

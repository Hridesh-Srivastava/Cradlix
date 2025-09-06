import { NextResponse } from "next/server"
import { healthCheck } from "@/lib/db/init"

export async function GET() {
  try {
    const health = await healthCheck()

    return NextResponse.json(health, {
      status: health.healthy ? 200 : 503,
    })
  } catch (error) {
    return NextResponse.json(
      {
        healthy: false,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Health check failed",
      },
      { status: 503 },
    )
  }
}

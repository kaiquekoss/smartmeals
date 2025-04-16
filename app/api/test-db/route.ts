import { NextResponse } from "next/server"
import { testDbConnection } from "@/lib/auth"

export async function GET() {
  try {
    const isConnected = await testDbConnection()

    if (isConnected) {
      return NextResponse.json({ status: "success", message: "Connected to MongoDB" })
    } else {
      return NextResponse.json({ status: "error", message: "Failed to connect to MongoDB" }, { status: 500 })
    }
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 })
  }
}

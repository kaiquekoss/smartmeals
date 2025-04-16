import { type NextRequest, NextResponse } from "next/server"
import { createUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.email || !data.password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log("Registration attempt:", { name: data.name, email: data.email })

    // Create user
    const user = await createUser(data.name, data.email, data.password)

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Registration error details:", error)

    if (error.message === "User already exists") {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 })
    }

    // Return more specific error message if available
    const errorMessage = error.message || "Failed to register user"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

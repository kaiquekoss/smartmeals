import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET a specific meal
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      console.log("Unauthorized access attempt to meal details")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("smartmeals")

    const meal = await db.collection("meals").findOne({
      _id: new ObjectId(params.id),
      userId: session.user.id,
    })

    if (!meal) {
      console.log(`Meal not found: ${params.id} for user ${session.user.id}`)
      return NextResponse.json({ error: "Meal not found" }, { status: 404 })
    }

    console.log(`Retrieved meal: ${params.id} for user ${session.user.id} at ${new Date().toISOString()}`)

    return NextResponse.json(meal)
  } catch (error) {
    console.error("Error fetching meal:", error)
    return NextResponse.json({ error: "Failed to fetch meal" }, { status: 500 })
  }
}

// PUT to update a meal
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      console.log("Unauthorized attempt to update meal")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.calories || !data.dateTime || !data.type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("smartmeals")

    // Check if meal exists and belongs to user
    const existingMeal = await db.collection("meals").findOne({
      _id: new ObjectId(params.id),
      userId: session.user.id,
    })

    if (!existingMeal) {
      console.log(`Update failed: Meal not found or unauthorized: ${params.id} for user ${session.user.id}`)
      return NextResponse.json({ error: "Meal not found or unauthorized" }, { status: 404 })
    }

    const updatedMeal = {
      name: data.name,
      description: data.description || "",
      calories: Number(data.calories),
      dateTime: new Date(data.dateTime),
      type: data.type,
      updatedAt: new Date(),
    }

    console.log("Atualizando refeição com data:", updatedMeal.dateTime.toISOString())

    await db.collection("meals").updateOne({ _id: new ObjectId(params.id) }, { $set: updatedMeal })

    console.log(`Meal updated: ${params.id} for user ${session.user.id} at ${new Date().toISOString()}`)

    return NextResponse.json({
      ...existingMeal,
      ...updatedMeal,
      _id: params.id,
    })
  } catch (error) {
    console.error("Error updating meal:", error)
    return NextResponse.json({ error: "Failed to update meal" }, { status: 500 })
  }
}

// DELETE a meal
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      console.log("Unauthorized attempt to delete meal")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("smartmeals")

    // Check if meal exists and belongs to user
    const existingMeal = await db.collection("meals").findOne({
      _id: new ObjectId(params.id),
      userId: session.user.id,
    })

    if (!existingMeal) {
      console.log(`Delete failed: Meal not found or unauthorized: ${params.id} for user ${session.user.id}`)
      return NextResponse.json({ error: "Meal not found or unauthorized" }, { status: 404 })
    }

    await db.collection("meals").deleteOne({ _id: new ObjectId(params.id) })

    console.log(`Meal deleted: ${params.id} for user ${session.user.id} at ${new Date().toISOString()}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting meal:", error)
    return NextResponse.json({ error: "Failed to delete meal" }, { status: 500 })
  }
}

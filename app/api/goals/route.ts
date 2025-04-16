import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")

    if (!date) {
      return NextResponse.json({ error: "Data não fornecida" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("smartmeals")

    const goal = await db.collection("goals").findOne({
      userId: session.user.id,
      date: date,
    })

    return NextResponse.json(goal || { calories: 2000 }) // Meta padrão se não houver uma definida
  } catch (error) {
    console.error("Erro ao buscar meta:", error)
    return NextResponse.json({ error: "Erro ao buscar meta" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const data = await request.json()
    const { calories, date } = data

    if (!calories || !date) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("smartmeals")

    const result = await db.collection("goals").updateOne(
      {
        userId: session.user.id,
        date: date,
      },
      {
        $set: {
          calories: Number(calories),
          updatedAt: new Date().toISOString(),
        },
      },
      { upsert: true }
    )

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error("Erro ao salvar meta:", error)
    return NextResponse.json({ error: "Erro ao salvar meta" }, { status: 500 })
  }
} 
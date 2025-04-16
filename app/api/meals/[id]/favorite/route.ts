import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { logger } from "@/lib/logger"

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("smartmeals")

    // Buscar a refeição atual
    const meal = await db.collection("meals").findOne({
      _id: new ObjectId(params.id),
      userId: session.user.id,
    })

    if (!meal) {
      return NextResponse.json({ error: "Refeição não encontrada" }, { status: 404 })
    }

    // Atualizar o status de favorito
    const result = await db.collection("meals").updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { isFavorite: !meal.isFavorite } }
    )

    logger.info(`Status de favorito atualizado para refeição ${params.id}`, {
      mealId: params.id,
      newStatus: !meal.isFavorite,
    })

    return NextResponse.json({ success: true, result })
  } catch (error) {
    logger.error("Erro ao atualizar favorito", error)
    return NextResponse.json({ error: "Erro ao atualizar favorito" }, { status: 500 })
  }
} 
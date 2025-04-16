import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

// GET all meals for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      console.log("Tentativa de acesso não autorizado à API de refeições")
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const date = searchParams.get("date")

    const client = await clientPromise
    const db = client.db("smartmeals")

    const query: any = { userId: session.user.id }

    // Filter by meal type if provided
    if (type) {
      query.type = type
    }

    // Filter by date if provided
    if (date) {
      console.log("Filtrando por data:", date)
      
      // Criar datas no fuso horário local
      const startDate = new Date(date + "T00:00:00")
      const endDate = new Date(date + "T23:59:59.999")
      
      console.log("Data de início (local):", startDate.toISOString())
      console.log("Data de fim (local):", endDate.toISOString())
      
      // Converter para UTC para a consulta no MongoDB
      const startDateUTC = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000)
      const endDateUTC = new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000)
      
      console.log("Data de início (UTC):", startDateUTC.toISOString())
      console.log("Data de fim (UTC):", endDateUTC.toISOString())
      
      query.dateTime = { $gte: startDateUTC, $lte: endDateUTC }
      
      // Verificar se há refeições para esta data
      const count = await db.collection("meals").countDocuments(query)
      console.log(`Encontradas ${count} refeições para a data ${date}`)
    }

    const meals = await db.collection("meals").find(query).sort({ dateTime: -1 }).toArray()

    console.log(`Retrieved ${meals.length} meals for user ${session.user.id} at ${new Date().toISOString()}`)
    
    // Verificar se as refeições têm o formato correto
    const formattedMeals = meals.map(meal => ({
      ...meal,
      _id: meal._id.toString(),
      userId: meal.userId.toString(),
      dateTime: meal.dateTime.toISOString(),
      createdAt: meal.createdAt.toISOString(),
      updatedAt: meal.updatedAt.toISOString(),
    }))
    
    console.log("Refeições formatadas:", JSON.stringify(formattedMeals, null, 2))

    return NextResponse.json(formattedMeals)
  } catch (error) {
    console.error("Erro ao buscar refeições:", error)
    return NextResponse.json({ error: "Falha ao buscar refeições" }, { status: 500 })
  }
}

// POST a new meal
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      console.log("Tentativa de acesso não autorizado à API de refeições")
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.calories || !data.dateTime || !data.type) {
      return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("smartmeals")

    const meal = {
      userId: session.user.id,
      name: data.name,
      description: data.description || "",
      calories: Number(data.calories),
      dateTime: new Date(data.dateTime),
      type: data.type,
      isFavorite: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    console.log("Criando refeição com data:", meal.dateTime.toISOString())

    const result = await db.collection("meals").insertOne(meal)

    console.log(`Meal created: ${data.name} for user ${session.user.id} at ${new Date().toISOString()}`)

    return NextResponse.json(
      {
        ...meal,
        _id: result.insertedId.toString(),
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Erro ao criar refeição:", error)
    return NextResponse.json({ error: "Falha ao criar refeição" }, { status: 500 })
  }
}

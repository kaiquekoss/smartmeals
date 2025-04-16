import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare, hash } from "bcryptjs"
import clientPromise from "./mongodb"

// Add this function to test the MongoDB connection
export async function testDbConnection() {
  try {
    const client = await clientPromise
    const db = client.db("smartmeals")
    console.log("Successfully connected to MongoDB")
    return true
  } catch (error) {
    console.error("MongoDB connection error:", error)
    return false
  }
}

// Definir a chave secreta diretamente aqui para garantir que seja usada
const secret = process.env.NEXTAUTH_SECRET || "c9a0b3e7d2f5a8c1b4e7d0f3a6c9b2e5d8f1a4c7b0e3d6a9f2c5b8e1d4a7f0c3"

// Estender o tipo Session para incluir o ID do usuário
declare module "next-auth" {
  interface Session {
    user: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const client = await clientPromise
          const db = client.db("smartmeals")
          const user = await db.collection("users").findOne({ email: credentials.email })

          if (!user) {
            console.log(`Authentication failed: No user found with email ${credentials.email}`)
            return null
          }

          const isPasswordValid = await compare(credentials.password, user.password)

          if (!isPasswordValid) {
            console.log(`Authentication failed: Invalid password for user ${credentials.email}`)
            return null
          }

          console.log(`Authentication successful: User ${credentials.email} logged in at ${new Date().toISOString()}`)

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
          }
        } catch (error) {
          console.error("Authentication error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: secret,
}

// Helper function to create a new user
export async function createUser(name: string, email: string, password: string) {
  try {
    console.log(`Attempting to create user: ${email}`)
    const client = await clientPromise
    const db = client.db("smartmeals")

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email })
    if (existingUser) {
      console.log(`User creation failed: Email ${email} already exists`)
      throw new Error("User already exists")
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Insert new user
    const result = await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    })

    console.log(`User created: ${email} at ${new Date().toISOString()} with ID ${result.insertedId}`)

    return { id: result.insertedId.toString(), name, email }
  } catch (error) {
    console.error("User creation error details:", error)
    throw error
  }
}

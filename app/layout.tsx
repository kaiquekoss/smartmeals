import type React from "react"
import { Inter } from "next/font/google"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

import { Toaster } from "@/components/ui/toaster"
import { Header } from "@/components/header"
import { Providers } from "@/components/providers"

import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "SmartMeals - Acompanhe Sua Nutrição Diária",
  description: "Acompanhe suas refeições diárias e calorias com SmartMeals",
    generator: 'v0.dev'
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} bg-background min-h-screen`}>
        <Providers session={session}>
          <Header />
          <main className="container py-6">{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}


import './globals.css'
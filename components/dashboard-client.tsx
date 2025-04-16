"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { MealCard } from "@/components/meal-card"
import { DailyGoalCard } from "@/components/daily-goal-card"
import { Pagination } from "@/components/pagination"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MealForm } from "@/components/meal-form"
import type { Meal } from "@/types"
import { logger } from "@/lib/logger"
import { ExportData } from "@/components/export-data"
import { OnboardingTour } from "@/components/onboarding-tour"

// Tradução dos tipos de refeição
const mealTypeTranslations = {
  Breakfast: "Café da Manhã",
  Lunch: "Almoço",
  "Afternoon Snack": "Lanche da Tarde",
  Dinner: "Jantar",
}

const ITEMS_PER_PAGE = 6

export function DashboardClient() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      // Redirecionar para a página de login se não estiver autenticado
      window.location.href = "/login"
    },
  })
  
  const router = useRouter()
  const [meals, setMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [showAddMealDialog, setShowAddMealDialog] = useState(false)
  const [totalCalories, setTotalCalories] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [dailyGoal, setDailyGoal] = useState(2000)

  // Fetch meals
  useEffect(() => {
    if (status === "authenticated") {
      fetchMeals()
      fetchDailyGoal()
    }
  }, [status, selectedDate, selectedType])

  // Calculate total calories
  useEffect(() => {
    const total = meals.reduce((sum, meal) => sum + meal.calories, 0)
    setTotalCalories(total)
  }, [meals])

  const fetchMeals = async () => {
    setLoading(true)
    try {
      // Formatar a data para o formato ISO (YYYY-MM-DD)
      const dateParam = format(selectedDate, "yyyy-MM-dd")
      logger.info("Buscando refeições", { date: dateParam, type: selectedType })
      
      let url = `/api/meals?date=${dateParam}`

      if (selectedType && selectedType !== "all") {
        url += `&type=${selectedType}`
      }

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error("Falha ao buscar refeições")
      }

      const data = await response.json()
      logger.info(`Encontradas ${data.length} refeições`)
      setMeals(data)
    } catch (error) {
      logger.error("Erro ao buscar refeições", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDailyGoal = async () => {
    try {
      const dateParam = format(selectedDate, "yyyy-MM-dd")
      const response = await fetch(`/api/goals?date=${dateParam}`)
      
      if (!response.ok) {
        throw new Error("Falha ao buscar meta diária")
      }

      const data = await response.json()
      setDailyGoal(data.calories || 2000)
    } catch (error) {
      logger.error("Erro ao buscar meta diária", error)
    }
  }

  const handleAddMeal = () => {
    setShowAddMealDialog(true)
  }

  const handleMealAdded = () => {
    setShowAddMealDialog(false)
    fetchMeals()
  }

  const handleMealDeleted = () => {
    fetchMeals()
  }

  const handleMealUpdated = () => {
    fetchMeals()
  }

  const handleToggleFavorite = async (mealId: string) => {
    try {
      const response = await fetch(`/api/meals/${mealId}/favorite`, {
        method: "PUT",
      })

      if (!response.ok) {
        throw new Error("Falha ao atualizar favorito")
      }

      fetchMeals()
    } catch (error) {
      logger.error("Erro ao atualizar favorito", error)
    }
  }

  const handleGoalUpdate = async (newGoal: number) => {
    try {
      const dateParam = format(selectedDate, "yyyy-MM-dd")
      const response = await fetch("/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          calories: newGoal,
          date: dateParam,
        }),
      })

      if (!response.ok) {
        throw new Error("Falha ao atualizar meta")
      }

      setDailyGoal(newGoal)
    } catch (error) {
      logger.error("Erro ao atualizar meta", error)
    }
  }

  // Paginação
  const totalPages = Math.ceil(meals.length / ITEMS_PER_PAGE)
  const paginatedMeals = meals.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  if (status === "loading") {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[200px]" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Painel</h1>
          <p className="text-muted-foreground">Acompanhe e gerencie suas refeições diárias</p>
        </div>
        <Button onClick={handleAddMeal}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Refeição
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div id="daily-goal-card">
          <DailyGoalCard
            totalCalories={totalCalories}
            dailyGoal={dailyGoal}
            onGoalUpdate={handleGoalUpdate}
          />
        </div>

        <Card id="date-selector">
          <CardHeader className="pb-2">
            <CardTitle>Data</CardTitle>
            <CardDescription>Selecione uma data para ver as refeições</CardDescription>
          </CardHeader>
          <CardContent>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn("w-full justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date || new Date())
                  }}
                  initialFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </CardContent>
        </Card>

        <Card id="meal-type-filter">
          <CardHeader className="pb-2">
            <CardTitle>Filtro</CardTitle>
            <CardDescription>Filtrar refeições por tipo</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedType || ""} onValueChange={(value) => setSelectedType(value || null)}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os tipos de refeição" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos de refeição</SelectItem>
                <SelectItem value="Breakfast">{mealTypeTranslations["Breakfast"]}</SelectItem>
                <SelectItem value="Lunch">{mealTypeTranslations["Lunch"]}</SelectItem>
                <SelectItem value="Afternoon Snack">{mealTypeTranslations["Afternoon Snack"]}</SelectItem>
                <SelectItem value="Dinner">{mealTypeTranslations["Dinner"]}</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mt-4">Suas Refeições</h2>
      <div className="flex justify-end mb-4">
        <div id="export-data-button">
          <ExportData meals={meals} date={selectedDate} />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[200px]" />
          ))}
        </div>
      ) : paginatedMeals.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedMeals.map((meal) => (
              <MealCard 
                key={meal._id.toString()} 
                meal={meal} 
                onDelete={handleMealDeleted} 
                onUpdate={handleMealUpdated}
                onToggleFavorite={() => handleToggleFavorite(meal._id.toString())}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">Nenhuma refeição encontrada para esta data</p>
            <Button id="add-meal-button" onClick={handleAddMeal}>
              <Plus className="mr-2 h-4 w-4" />
              Adicione Sua Primeira Refeição
            </Button>
          </CardContent>
        </Card>
      )}

      <OnboardingTour isNewUser={meals.length === 0} />

      <Dialog open={showAddMealDialog} onOpenChange={setShowAddMealDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Refeição</DialogTitle>
            <DialogDescription>
              Adicione uma nova refeição ao seu registro. Clique em salvar quando terminar.
            </DialogDescription>
          </DialogHeader>
          <MealForm onSuccess={handleMealAdded} />
        </DialogContent>
      </Dialog>
    </div>
  )
} 
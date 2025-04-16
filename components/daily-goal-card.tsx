"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"

interface DailyGoalCardProps {
  totalCalories: number
  dailyGoal?: number
  onGoalUpdate: (newGoal: number) => void
}

export function DailyGoalCard({ totalCalories, dailyGoal = 2000, onGoalUpdate }: DailyGoalCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [newGoal, setNewGoal] = useState(dailyGoal.toString())
  const progress = Math.min((totalCalories / dailyGoal) * 100, 100)

  const handleSave = () => {
    const goal = parseInt(newGoal)
    if (isNaN(goal) || goal <= 0) {
      toast({
        title: "Erro",
        description: "Por favor, insira uma meta válida maior que zero.",
        variant: "destructive",
      })
      return
    }
    onGoalUpdate(goal)
    setIsEditing(false)
    toast({
      title: "Sucesso",
      description: "Meta diária atualizada com sucesso!",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meta Diária de Calorias</CardTitle>
        <CardDescription>
          Acompanhe seu progresso em relação à sua meta diária
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {totalCalories} / {dailyGoal} calorias
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancelar" : "Editar Meta"}
            </Button>
          </div>
          
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="Nova meta diária"
              />
              <Button size="sm" onClick={handleSave}>
                Salvar
              </Button>
            </div>
          ) : (
            <Progress value={progress} className="h-2" />
          )}
          
          <p className="text-sm text-muted-foreground">
            {progress >= 100
              ? "Você atingiu sua meta diária! 🎉"
              : `Faltam ${dailyGoal - totalCalories} calorias para atingir sua meta`}
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 
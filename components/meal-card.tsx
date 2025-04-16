"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Edit, Trash2 } from "lucide-react"
import { motion } from "framer-motion"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AccessibleButton } from "@/components/ui/accessible-button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { MealForm } from "@/components/meal-form"
import { FavoriteButton } from "@/components/favorite-button"
import type { Meal } from "@/types"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { logger } from "@/lib/logger"

// Tradução dos tipos de refeição
const mealTypeTranslations = {
  Breakfast: "Café da Manhã",
  Lunch: "Almoço",
  "Afternoon Snack": "Lanche da Tarde",
  Dinner: "Jantar",
}

interface MealCardProps {
  meal: Meal
  onDelete: () => void
  onUpdate: () => void
  onToggleFavorite: () => void
}

export function MealCard({ meal, onDelete, onUpdate, onToggleFavorite }: MealCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/meals/${meal._id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Falha ao excluir refeição")
      }

      logger.info(`Refeição excluída: ${meal.name}`, { mealId: meal._id })
      toast({
        title: "Refeição excluída",
        description: `${meal.name} foi excluída com sucesso`,
      })

      onDelete()
    } catch (error: any) {
      logger.error("Erro ao excluir refeição", error)
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{meal.name}</CardTitle>
              <CardDescription>
                {format(new Date(meal.dateTime), "PPP 'às' p", { locale: ptBR })}
                <br />
                <small>ID: {meal._id.toString()}</small>
                <br />
                <small>Data UTC: {new Date(meal.dateTime).toISOString()}</small>
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <FavoriteButton
                isFavorite={meal.isFavorite}
                onToggle={onToggleFavorite}
              />
              <Badge variant="outline" className="ml-2">
                {mealTypeTranslations[meal.type]}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {meal.description && <p className="text-sm">{meal.description}</p>}
            <p className="font-semibold">{meal.calories} calorias</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <AccessibleButton 
            variant="outline" 
            size="sm" 
            onClick={() => setShowEditDialog(true)}
            ariaLabel={`Editar refeição ${meal.name}`}
            ariaHaspopup="dialog"
            ariaControls="edit-meal-dialog"
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </AccessibleButton>
          <AccessibleButton 
            variant="destructive" 
            size="sm" 
            onClick={() => setShowDeleteDialog(true)}
            ariaLabel={`Excluir refeição ${meal.name}`}
            ariaHaspopup="dialog"
            ariaControls="delete-meal-dialog"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </AccessibleButton>
        </CardFooter>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Refeição</DialogTitle>
            <DialogDescription>
              Faça alterações na sua refeição aqui. Clique em salvar quando terminar.
            </DialogDescription>
          </DialogHeader>
          <MealForm
            meal={meal}
            onSuccess={() => {
              setShowEditDialog(false)
              onUpdate()
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Excluir Refeição</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta refeição? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ArrowRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface TourStep {
  target: string
  title: string
  content: string
  position: "top" | "right" | "bottom" | "left"
}

const tourSteps: TourStep[] = [
  {
    target: "daily-goal-card",
    title: "Meta Diária de Calorias",
    content: "Aqui você pode definir sua meta diária de calorias e acompanhar seu progresso.",
    position: "bottom"
  },
  {
    target: "date-selector",
    title: "Seletor de Data",
    content: "Escolha uma data para ver suas refeições registradas naquele dia.",
    position: "bottom"
  },
  {
    target: "meal-type-filter",
    title: "Filtro de Tipo de Refeição",
    content: "Filtre suas refeições por tipo: café da manhã, almoço, lanche ou jantar.",
    position: "bottom"
  },
  {
    target: "calories-chart",
    title: "Gráfico de Calorias",
    content: "Visualize seu consumo de calorias nos últimos 7 dias.",
    position: "top"
  },
  {
    target: "add-meal-button",
    title: "Adicionar Refeição",
    content: "Clique aqui para adicionar uma nova refeição ao seu registro.",
    position: "bottom"
  },
  {
    target: "export-data-button",
    title: "Exportar Dados",
    content: "Exporte suas refeições em formato CSV para análise externa.",
    position: "top"
  }
]

interface OnboardingTourProps {
  isNewUser?: boolean
}

export function OnboardingTour({ isNewUser = false }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [hasCompletedTour, setHasCompletedTour] = useState(false)

  useEffect(() => {
    // Verificar se o usuário já completou o tour
    const tourCompleted = localStorage.getItem("tourCompleted")
    if (tourCompleted === "true") {
      setHasCompletedTour(true)
      return
    }

    // Mostrar o tour para novos usuários ou quando solicitado
    if (isNewUser) {
      setIsVisible(true)
    }
  }, [isNewUser])

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      completeTour()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const completeTour = () => {
    setIsVisible(false)
    localStorage.setItem("tourCompleted", "true")
    setHasCompletedTour(true)
  }

  if (!isVisible || hasCompletedTour) {
    return null
  }

  const step = tourSteps[currentStep]
  const targetElement = document.getElementById(step.target)

  if (!targetElement) {
    return null
  }

  const rect = targetElement.getBoundingClientRect()
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const scrollLeft = window.scrollX || document.documentElement.scrollLeft

  // Calcular posição do tooltip com base na posição do elemento alvo
  let tooltipStyle = {}
  
  switch (step.position) {
    case "top":
      tooltipStyle = {
        top: rect.top + scrollTop - 10,
        left: rect.left + scrollLeft + rect.width / 2,
        transform: "translate(-50%, -100%)"
      }
      break
    case "right":
      tooltipStyle = {
        top: rect.top + scrollTop + rect.height / 2,
        left: rect.right + scrollLeft + 10,
        transform: "translateY(-50%)"
      }
      break
    case "bottom":
      tooltipStyle = {
        top: rect.bottom + scrollTop + 10,
        left: rect.left + scrollLeft + rect.width / 2,
        transform: "translateX(-50%)"
      }
      break
    case "left":
      tooltipStyle = {
        top: rect.top + scrollTop + rect.height / 2,
        left: rect.left + scrollLeft - 10,
        transform: "translate(-100%, -50%)"
      }
      break
  }

  return (
    <>
      {/* Overlay escuro */}
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={completeTour}
      />
      
      {/* Destaque do elemento alvo */}
      <div
        className="fixed z-50 rounded-md ring-2 ring-primary ring-offset-2 ring-offset-background"
        style={{
          top: rect.top + scrollTop,
          left: rect.left + scrollLeft,
          width: rect.width,
          height: rect.height,
        }}
      />
      
      {/* Tooltip do tour */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="fixed z-50 w-80"
          style={tooltipStyle}
        >
          <Card className="shadow-lg">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{step.title}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={completeTour}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{step.content}</p>
              <div className="flex justify-between items-center">
                <div className="flex gap-1">
                  {tourSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 w-2 rounded-full ${
                        index === currentStep ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  {currentStep > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrevious}
                      className="h-8"
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Anterior
                    </Button>
                  )}
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleNext}
                    className="h-8"
                  >
                    {currentStep === tourSteps.length - 1 ? "Concluir" : "Próximo"}
                    {currentStep < tourSteps.length - 1 && (
                      <ArrowRight className="h-4 w-4 ml-1" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </>
  )
} 
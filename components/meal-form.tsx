"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { Meal, MealType } from "@/types"
import { toast } from "@/components/ui/use-toast"

// Tradução dos tipos de refeição
const mealTypeTranslations = {
  Breakfast: "Café da Manhã",
  Lunch: "Almoço",
  "Afternoon Snack": "Lanche da Tarde",
  Dinner: "Jantar",
}

const mealTypes: MealType[] = ["Breakfast", "Lunch", "Afternoon Snack", "Dinner"]

const formSchema = z.object({
  name: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }),
  description: z.string().optional(),
  calories: z.coerce.number().min(1, {
    message: "As calorias devem ser pelo menos 1.",
  }),
  dateTime: z.date({
    required_error: "Por favor, selecione uma data e hora.",
  }),
  type: z.enum(["Breakfast", "Lunch", "Afternoon Snack", "Dinner"], {
    required_error: "Por favor, selecione um tipo de refeição.",
  }),
})

interface MealFormProps {
  meal?: Meal
  onSuccess?: () => void
}

export function MealForm({ meal, onSuccess }: MealFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: meal
      ? {
          name: meal.name,
          description: meal.description,
          calories: meal.calories,
          dateTime: new Date(meal.dateTime),
          type: meal.type,
        }
      : {
          name: "",
          description: "",
          calories: 0,
          dateTime: new Date(),
          type: "Breakfast",
        },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      const endpoint = meal ? `/api/meals/${meal._id}` : "/api/meals"

      const method = meal ? "PUT" : "POST"

      // Garantir que a data esteja no formato correto
      const formattedDateTime = values.dateTime.toISOString()
      console.log("Data formatada para envio:", formattedDateTime)
      console.log("Data local:", values.dateTime.toLocaleString())
      console.log("Data UTC:", values.dateTime.toISOString())

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          dateTime: formattedDateTime,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Algo deu errado")
      }

      toast({
        title: meal ? "Refeição atualizada" : "Refeição criada",
        description: `${meal ? "Atualizada" : "Criada"} com sucesso: ${values.name}`,
      })

      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome da refeição" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea placeholder="Descreva sua refeição" className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="calories"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Calorias</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Calorias" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dateTime"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data e Hora</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                    >
                      {field.value ? (
                        format(field.value, "PPP HH:mm", { locale: ptBR })
                      ) : (
                        <span>Escolha uma data e hora</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      if (date) {
                        const currentDate = field.value || new Date()
                        date.setHours(currentDate.getHours(), currentDate.getMinutes())
                        field.onChange(date)
                      }
                    }}
                    initialFocus
                    locale={ptBR}
                  />
                  <div className="p-3 border-t">
                    <Input
                      type="time"
                      value={field.value ? format(field.value, "HH:mm") : ""}
                      onChange={(e) => {
                        const [hours, minutes] = e.target.value.split(":")
                        const date = field.value || new Date()
                        date.setHours(Number.parseInt(hours), Number.parseInt(minutes))
                        field.onChange(date)
                      }}
                    />
                  </div>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Refeição</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um tipo de refeição" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {mealTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {mealTypeTranslations[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : meal ? "Atualizar Refeição" : "Adicionar Refeição"}
        </Button>
      </form>
    </Form>
  )
}

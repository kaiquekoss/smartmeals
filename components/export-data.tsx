"use client"

import { useState } from "react"
import { Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { Meal } from "@/types"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

interface ExportDataProps {
  meals: Meal[]
  date: Date
}

export function ExportData({ meals, date }: ExportDataProps) {
  const [isExporting, setIsExporting] = useState(false)

  const exportToCSV = () => {
    setIsExporting(true)
    
    try {
      // Cabeçalho do CSV
      const headers = ["Nome", "Descrição", "Calorias", "Data/Hora", "Tipo", "Favorito"]
      
      // Converter refeições para linhas CSV
      const rows = meals.map(meal => [
        meal.name,
        meal.description || "",
        meal.calories.toString(),
        format(new Date(meal.dateTime), "dd/MM/yyyy HH:mm", { locale: ptBR }),
        meal.type,
        meal.isFavorite ? "Sim" : "Não"
      ])
      
      // Adicionar cabeçalho e linhas
      const csvContent = [
        headers.join(","),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
      ].join("\n")
      
      // Criar blob e link para download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      
      // Nome do arquivo com a data
      const fileName = `refeicoes_${format(date, "yyyy-MM-dd")}.csv`
      
      link.setAttribute("href", url)
      link.setAttribute("download", fileName)
      link.style.visibility = "hidden"
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast({
        title: "Exportação concluída",
        description: `Seus dados foram exportados para ${fileName}`,
      })
    } catch (error) {
      console.error("Erro ao exportar dados:", error)
      toast({
        title: "Erro na exportação",
        description: "Ocorreu um erro ao exportar seus dados. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const exportToPDF = () => {
    setIsExporting(true)
    
    try {
      // Criar um novo documento PDF
      const doc = new jsPDF()
      
      // Adicionar título
      doc.setFontSize(18)
      doc.text("Relatório de Refeições", 14, 20)
      
      // Adicionar data
      doc.setFontSize(12)
      doc.text(`Data: ${format(date, "dd/MM/yyyy", { locale: ptBR })}`, 14, 30)
      
      // Adicionar total de calorias
      const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0)
      doc.text(`Total de Calorias: ${totalCalories} kcal`, 14, 40)
      
      // Preparar dados para a tabela
      const tableData = meals.map(meal => [
        meal.name,
        meal.description || "",
        meal.calories.toString(),
        format(new Date(meal.dateTime), "dd/MM/yyyy HH:mm", { locale: ptBR }),
        meal.type,
        meal.isFavorite ? "Sim" : "Não"
      ])
      
      // Adicionar tabela
      autoTable(doc, {
        head: [["Nome", "Descrição", "Calorias", "Data/Hora", "Tipo", "Favorito"]],
        body: tableData,
        startY: 50,
        theme: "grid",
        headStyles: { fillColor: [59, 130, 246] },
        styles: { fontSize: 10 },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 50 },
          2: { cellWidth: 30 },
          3: { cellWidth: 40 },
          4: { cellWidth: 40 },
          5: { cellWidth: 30 }
        }
      })
      
      // Adicionar rodapé
      const pageCount = doc.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.text(
          `Página ${i} de ${pageCount} - SmartMeals - ${format(new Date(), "dd/MM/yyyy", { locale: ptBR })}`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: "center" }
        )
      }
      
      // Salvar o PDF
      const fileName = `refeicoes_${format(date, "yyyy-MM-dd")}.pdf`
      doc.save(fileName)
      
      toast({
        title: "Exportação concluída",
        description: `Seus dados foram exportados para ${fileName}`,
      })
    } catch (error) {
      console.error("Erro ao exportar PDF:", error)
      toast({
        title: "Erro na exportação",
        description: "Ocorreu um erro ao exportar seus dados para PDF. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={exportToCSV} 
        disabled={isExporting || meals.length === 0}
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        {isExporting ? "Exportando..." : "CSV"}
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={exportToPDF} 
        disabled={isExporting || meals.length === 0}
        className="flex items-center gap-2"
      >
        <FileText className="h-4 w-4" />
        {isExporting ? "Exportando..." : "PDF"}
      </Button>
    </div>
  )
} 
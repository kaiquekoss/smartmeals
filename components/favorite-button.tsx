"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

interface FavoriteButtonProps {
  isFavorite: boolean
  onToggle: () => void
  className?: string
}

export function FavoriteButton({ isFavorite, onToggle, className }: FavoriteButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleClick = () => {
    setIsAnimating(true)
    onToggle()
    toast({
      title: isFavorite ? "Removido dos favoritos" : "Adicionado aos favoritos",
      description: isFavorite 
        ? "A refeição foi removida da sua lista de favoritos"
        : "A refeição foi adicionada à sua lista de favoritos",
    })
    setTimeout(() => setIsAnimating(false), 500)
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      className={className}
    >
      <motion.div
        animate={isAnimating ? { scale: 1.2, rotate: 180 } : { scale: 1, rotate: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Star
          className={`h-5 w-5 ${
            isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
          }`}
        />
      </motion.div>
    </Button>
  )
} 
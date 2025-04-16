"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { DeliveryService, DeliveryRestaurant } from "@/types"
import { deliveryService } from "@/lib/delivery-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Clock, DollarSign, Star } from "lucide-react"
import { logger } from "@/lib/logger"

export function DeliveryRestaurants() {
  const [services, setServices] = useState<DeliveryService[]>([])
  const [selectedService, setSelectedService] = useState<string>("")
  const [restaurants, setRestaurants] = useState<DeliveryRestaurant[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const availableServices = deliveryService.getAvailableServices()
    setServices(availableServices)
    if (availableServices.length > 0) {
      setSelectedService(availableServices[0].id)
    }
  }, [])

  const handleSearch = async () => {
    if (!selectedService) return

    setLoading(true)
    try {
      // TODO: Implementar geolocalização real
      const location = { lat: -23.5505, lng: -46.6333 } // São Paulo
      const results = await deliveryService.searchRestaurants(
        selectedService,
        searchQuery,
        location
      )
      setRestaurants(results)
      logger.info(`Buscados ${results.length} restaurantes no ${selectedService}`)
    } catch (error) {
      logger.error("Erro ao buscar restaurantes", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <Select value={selectedService} onValueChange={setSelectedService}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Selecione um serviço" />
          </SelectTrigger>
          <SelectContent>
            {services.map((service) => (
              <SelectItem key={service.id} value={service.id}>
                {service.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex-1 flex gap-2">
          <Input
            placeholder="Buscar restaurantes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={loading}>
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {restaurants.map((restaurant) => (
          <motion.div
            key={restaurant.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>{restaurant.name}</CardTitle>
                <CardDescription>{restaurant.cuisine}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span>{restaurant.rating}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{restaurant.deliveryTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span>Pedido mínimo: R$ {restaurant.minimumOrder}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
} 
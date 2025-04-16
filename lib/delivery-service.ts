import { DeliveryService, DeliveryRestaurant, DeliveryMenuItem } from "@/types"
import { logger } from "./logger"

class DeliveryServiceManager {
  private static instance: DeliveryServiceManager
  private services: Map<string, DeliveryService> = new Map()

  private constructor() {
    // Inicializar serviços de delivery
    this.services.set("ifood", {
      id: "ifood",
      name: "iFood",
      logo: "/images/ifood-logo.png",
      baseUrl: "https://api.ifood.com",
    })

    this.services.set("rappi", {
      id: "rappi",
      name: "Rappi",
      logo: "/images/rappi-logo.png",
      baseUrl: "https://api.rappi.com",
    })

    this.services.set("ubereats", {
      id: "ubereats",
      name: "Uber Eats",
      logo: "/images/ubereats-logo.png",
      baseUrl: "https://api.ubereats.com",
    })
  }

  static getInstance(): DeliveryServiceManager {
    if (!DeliveryServiceManager.instance) {
      DeliveryServiceManager.instance = new DeliveryServiceManager()
    }
    return DeliveryServiceManager.instance
  }

  async searchRestaurants(
    serviceId: string,
    query: string,
    location: { lat: number; lng: number }
  ): Promise<DeliveryRestaurant[]> {
    try {
      const service = this.services.get(serviceId)
      if (!service) {
        throw new Error(`Serviço de delivery não encontrado: ${serviceId}`)
      }

      logger.info(`Buscando restaurantes no ${service.name}`, { query, location })

      // TODO: Implementar chamada real à API do serviço
      // Por enquanto, retornando dados mockados
      return [
        {
          id: "1",
          name: "Restaurante Exemplo",
          cuisine: "Brasileira",
          rating: 4.5,
          deliveryTime: "30-45 min",
          minimumOrder: 20,
          deliveryFee: 5,
          image: "/images/restaurant-placeholder.jpg",
        },
      ]
    } catch (error) {
      logger.error(`Erro ao buscar restaurantes no ${serviceId}`, error)
      throw error
    }
  }

  async getRestaurantMenu(
    serviceId: string,
    restaurantId: string
  ): Promise<DeliveryMenuItem[]> {
    try {
      const service = this.services.get(serviceId)
      if (!service) {
        throw new Error(`Serviço de delivery não encontrado: ${serviceId}`)
      }

      logger.info(`Buscando cardápio do restaurante ${restaurantId} no ${service.name}`)

      // TODO: Implementar chamada real à API do serviço
      // Por enquanto, retornando dados mockados
      return [
        {
          id: "1",
          name: "Prato Exemplo",
          description: "Descrição do prato",
          price: 25.90,
          calories: 500,
          image: "/images/food-placeholder.jpg",
          category: "Principais",
          restaurantId,
        },
      ]
    } catch (error) {
      logger.error(`Erro ao buscar cardápio do restaurante ${restaurantId}`, error)
      throw error
    }
  }

  getAvailableServices(): DeliveryService[] {
    return Array.from(this.services.values())
  }
}

export const deliveryService = DeliveryServiceManager.getInstance() 
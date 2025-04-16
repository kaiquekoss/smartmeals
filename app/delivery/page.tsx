import { DeliveryRestaurants } from "@/components/delivery-restaurants"

export default function DeliveryPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Delivery de Comida</h1>
          <p className="text-muted-foreground">
            Encontre restaurantes e faça pedidos através dos nossos parceiros
          </p>
        </div>

        <DeliveryRestaurants />
      </div>
    </div>
  )
} 
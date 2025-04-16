import type { ObjectId } from "mongodb"

export type User = {
  _id: string
  name: string
  email: string
  image?: string
  dailyCalorieGoal?: number
  createdAt: string
  updatedAt: string
}

export type MealType = "Breakfast" | "Lunch" | "Afternoon Snack" | "Dinner"

export type Meal = {
  _id: string | ObjectId
  userId: string | ObjectId
  name: string
  description: string
  calories: number
  dateTime: Date
  type: MealType
  isFavorite: boolean
  createdAt: Date
  updatedAt: Date
}

export type MealFormData = {
  name: string
  description: string
  calories: number
  dateTime: string
  type: MealType
}

export type DailyGoal = {
  _id: string
  userId: string
  calories: number
  date: string
  createdAt: string
  updatedAt: string
}

export type DeliveryService = {
  id: string
  name: string
  logo: string
  baseUrl: string
  apiKey?: string
}

export type DeliveryRestaurant = {
  id: string
  name: string
  cuisine: string
  rating: number
  deliveryTime: string
  minimumOrder: number
  deliveryFee: number
  image: string
}

export type DeliveryMenuItem = {
  id: string
  name: string
  description: string
  price: number
  calories: number
  image: string
  category: string
  restaurantId: string
}

import { Meta } from "@/types/apiResponse.type";

export interface ProductsResponse {
  result: Product[];
  meta: Meta
}
export interface Product {
  id: number
  name: string
  description: string
  buyPrice: number
  sellPrice: number
  quantity: number
  image: string
  status: string
  date: string
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
  supplier: Supplier
  category: Category
}

export interface Supplier {
  id: number
  name: string
  description: string
  image: string
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
}
export interface Category {
  id: number
  name: string
  image: string
  description: string
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
}
import { Meta } from "@/types/apiResponse.type";

export interface User {
  id: number;
  username: string;
  fullname: string;
}

export interface Supplier {
  id: number;
  name: string;
  description: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  buyPrice: number;
  sellPrice: number;
  quantity: number;
  image: string;
  status: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface ImportDetail {
  id: number;
  price: number;
  quantity: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string | null;
  createdBy: string;
  updatedBy: string | null;
  importHistoryId: number;
  product: Product;
}

export interface ImportHistory {
  id: number;
  user: User;
  supplier: Supplier;
  importDetails: ImportDetail[];
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface ImportHistoryResponse {
  meta: Meta;
  result: ImportHistory[];
} 
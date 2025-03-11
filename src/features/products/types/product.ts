export interface Product {
  id: string;
  code: string;
  name: string;
  sellPrice: number;
  costPrice: number;
  quantity: number;
  status: 'in_stock' | 'out_of_stock';
  createdAt: string;
  category: string;
  image?: string;
  description?: string;
}

export interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface ProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  category?: string;
  status?: string;
} 
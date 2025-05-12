import { Meta } from "@/types/apiResponse.type";

export interface CustomersResponse {
  result: Customer[];
  meta: Meta;
}

export interface Customer {
  id: number;
  fullname: string;
  phone: string;
  point: number;
  createdAt: string;
  updatedAt: string | null;
  createdBy: string;
  updatedBy: string | null;
  active: boolean;
}

export interface CustomerParams {
  page?: number;
  size?: number;
  search?: string;
  active?: boolean;
} 
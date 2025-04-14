import { Category } from "../types/product";
import { DetailResponse } from './../../../types/apiResponse.type';

import axiosClient from "@/lib/axios";
import { ApiResponse } from "@/types/apiResponse.type";

// Fetch all categories
export const fetchCategories = async (): Promise<Category[]> => {
  const response = await axiosClient.get<ApiResponse<DetailResponse<Category[]>>>("categories");
  return response.data.data.result;
};
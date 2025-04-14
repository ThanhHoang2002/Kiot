import { Supplier } from "../types/product";

import axiosClient from "@/lib/axios";
import { ApiResponse, DetailResponse } from "@/types/apiResponse.type";

export const fetchSuppliers = async (): Promise<Supplier[]> => {
    const response = await axiosClient.get<ApiResponse<DetailResponse<Supplier[]>>>("suppliers");
    return response.data.data.result;
  };
import axiosClient from "@/lib/axios"
import { ApiResponse } from "@/types/apiResponse.type"
import { ShiftsResponse } from "../types"

interface GetShiftsParams {
  page?: number
  pageSize?: number
}

export const getShifts = async (params: GetShiftsParams = {}): Promise<ShiftsResponse> => {
  const { page = 1, pageSize = 20 } = params
  
  try {
    const response = await axiosClient.get<ApiResponse<ShiftsResponse>>('/shifts', {
      params: { page, pageSize }
    })
    return response.data.data
  } catch (error) {
    console.error("Error fetching shifts:", error)
    throw error
  }
} 
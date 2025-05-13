import axiosClient from "@/lib/axios"
import { ApiResponse } from "@/types/apiResponse.type"
import { ShiftOrdersResponse } from "../types"

interface GetShiftOrdersParams {
  page?: number
  pageSize?: number
}

export const getShiftOrders = async (
  shiftId: number, 
  params: GetShiftOrdersParams = {}
): Promise<ShiftOrdersResponse> => {
  const { page = 1, pageSize = 20 } = params
  
  try {
    const response = await axiosClient.get<ApiResponse<ShiftOrdersResponse>>(
      `/shifts/${shiftId}/orders`, 
      { params: { page, pageSize } }
    )
    return response.data.data
  } catch (error) {
    console.error(`Error fetching orders for shift ${shiftId}:`, error)
    throw error
  }
} 
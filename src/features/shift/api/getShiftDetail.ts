import axiosClient from "@/lib/axios"
import { ApiResponse } from "@/types/apiResponse.type"
import { ShiftDetail } from "../types"

export const getShiftDetail = async (shiftId: number): Promise<ShiftDetail> => {
  try {
    const response = await axiosClient.get<ApiResponse<ShiftDetail>>(`/shifts/${shiftId}`)
    return response.data.data
  } catch (error) {
    console.error(`Error fetching shift detail for ID ${shiftId}:`, error)
    throw error
  }
} 
import { CurrentShift } from "../types"

import axiosClient from "@/lib/axios"
import { ApiResponse } from "@/types/apiResponse.type"

export interface CloseShiftData {
  endCash: number
  note?: string
}

export const closeShift = async (data: CloseShiftData): Promise<CurrentShift> => {
  try {
    const response = await axiosClient.post<ApiResponse<CurrentShift>>('shifts/close-current', data)
    return response.data.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

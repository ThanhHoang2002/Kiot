import { CurrentShift } from "../types"

import axiosClient from "@/lib/axios"
import { ApiResponse } from "@/types/apiResponse.type"

export interface OpenShiftData {
  startCash: number
}

export const openShift = async (data: OpenShiftData): Promise<CurrentShift> => {
  const response = await axiosClient.post<ApiResponse<CurrentShift>>('shifts/open', data)
  return response.data.data
}

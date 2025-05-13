import { CurrentShift, NoHaveShift } from "../types"

import axiosClient from "@/lib/axios"
import { ApiResponse } from "@/types/apiResponse.type"

export const getCurrentShift = async (): Promise<CurrentShift | NoHaveShift>  => {
    const response = await axiosClient.get<ApiResponse<CurrentShift | NoHaveShift>>(`shifts/current`)
    return response.data.data
}


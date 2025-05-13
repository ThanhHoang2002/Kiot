import { useQuery } from "@tanstack/react-query"

import { getCurrentShift } from "../api/getCurrentShift"

export const useCurrentShift = () => {
    const { data: currentShift, isLoading, error } = useQuery({
        queryKey: ["currentShift"],
        queryFn: getCurrentShift
    })

    // Kiểm tra nếu có shift hiện tại
    const hasOpenShift = Boolean(currentShift && "id" in currentShift)

    return {
        currentShift,
        isLoading,
        error,
        hasOpenShift
    }
}
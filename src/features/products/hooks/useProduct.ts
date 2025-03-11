import { useQuery } from "@tanstack/react-query"

import { fetchDetailsProducts } from "../api/productsApi"

export const useProduct = (id:string )=>{
    const {data,isLoading} = useQuery({
        queryKey: ['products', id],
        queryFn: ()=>fetchDetailsProducts(id),
        enabled: !!id
    })
    return {
        data,
        isLoading,
    }
}
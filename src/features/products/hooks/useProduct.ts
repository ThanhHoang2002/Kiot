import { useMutation, useQuery } from "@tanstack/react-query"

import { fetchDetailsProduct, deleteProduct, updateProduct } from "../api/productsApi"
import { ProductFormValues } from "../schema/product.schema"

export const useProduct = (id:number )=>{
    const get = useQuery({
        queryKey: ['products', id],
        queryFn: ()=>fetchDetailsProduct(id),
        enabled: !!id
    })
    const update = useMutation({
        mutationFn: (product:ProductFormValues)=>updateProduct(product),
    })
    const deletes = useMutation({
        mutationFn: (id:number)=>deleteProduct(id),
    })
    return {get, update, deletes}
}
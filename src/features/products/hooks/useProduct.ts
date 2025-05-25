import { useMutation, useQuery } from "@tanstack/react-query"

import { fetchDetailsProduct, deleteProduct, updateProduct, createProduct } from "../api/productsApi"

import { useApiErrorHandler } from "@/hooks/useApiErrorHandler"
import { queryClient } from "@/lib/query-client"
export const useProduct = (id: number) => {
    // Query để lấy thông tin sản phẩm
    const { handleError } = useApiErrorHandler()
    const get = useQuery({
        queryKey: ['products', id],
        queryFn: () => fetchDetailsProduct(id),
        enabled: !!id
    })

    // Mutation để cập nhật sản phẩm
    const update = useMutation({
        mutationFn: (formData: FormData) => updateProduct(id.toString(), formData),
        onSuccess: () => {
            // Invalidate queries để cập nhật dữ liệu mới
            queryClient.invalidateQueries({ queryKey: ['products', id] })
            queryClient.invalidateQueries({ queryKey: ['products'] })
        },
        onError: (error) => {
            handleError(error)
        }
    })

    // Mutation để tạo sản phẩm mới
    const create = useMutation({
        mutationFn: (formData: FormData) => createProduct(formData),
        onSuccess: () => {
            // Invalidate queries để cập nhật danh sách sản phẩm
            queryClient.invalidateQueries({ queryKey: ['products'] })
        },
        onError: (error) => {
            handleError(error)
        }
    })

    // Mutation để xóa sản phẩm
    const deletes = useMutation({
        mutationFn: (id: number) => deleteProduct(id),
        onSuccess: () => {
            // Sau khi xóa thành công, xóa cache của sản phẩm đã xóa
            // để ngăn hook gọi lại API get product cho sản phẩm không còn tồn tại
            queryClient.removeQueries({ queryKey: ['products', id] })
            
            // Chỉ invalidate danh sách sản phẩm (không kèm ID cụ thể)
            queryClient.invalidateQueries({ 
                queryKey: ['products'],
            })
        }
    })

    return { get, update, create, deletes }
}
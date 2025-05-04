import { Item, sfEqual, sfLike, sfOr } from "spring-filter-query-builder";

import { CreateUserPayload, UserFilterParams, UserResponse } from '../types';

import axiosClient from '@/lib/axios';

const BASE_PATH = '/users';

/**
 * Fetch users with filtering and pagination
 */
export const getUsers = async (params: UserFilterParams = {}): Promise<UserResponse> => {
    // Xây dựng filter từ các điều kiện cơ bản
    const filterItems: Item[] = [];
    
    // Điều kiện tìm kiếm theo username hoặc tên
    if (params.search) {
        // Sử dụng sfOr với một mảng các điều kiện
        filterItems.push(
            sfOr([
                sfLike('username', `*${params.search}*`),
                sfLike('name', `*${params.search}*`)
            ])
        );
    }
    
    // Nếu có role ID, thêm điều kiện
    if (params.roleId) {
        filterItems.push(sfEqual('role.id', params.roleId.toString()));
    }
    
    // Tạo filter string từ các điều kiện
    let filterStr: string | undefined;
    if (filterItems.length > 0) {
        if (filterItems.length === 1) {
            filterStr = filterItems[0].toString();
        } else {
            // Kết hợp các điều kiện với AND
            filterStr = filterItems.map(item => item.toString()).join(' and ');
        }
    }
    
    // Chuẩn bị tham số cho request
    const requestParams: {
        page?: number;
        size?: number;
        filter?: string;
    } = {
        page: params.page || 1,
        size: params.pageSize || 20,
    };
    
    // Nếu có filter, thêm vào request params
    if (filterStr) {
        requestParams.filter = filterStr;
    }
    
    const response = await axiosClient.get<UserResponse>(BASE_PATH, { params: requestParams });
    return response.data;
};

/**
 * Get user details by ID
 */
export const getUserById = async (userId: number): Promise<UserResponse> => {
    const response = await axiosClient.get<UserResponse>(`${BASE_PATH}/${userId}`);
    return response.data;
};

/**
 * Create a new user
 */
export const createUser = async (userData: FormData | CreateUserPayload): Promise<UserResponse> => {
    const config = userData instanceof FormData 
        ? { 
            headers: {
                'Content-Type': 'multipart/form-data'
            } 
        } 
        : {};
        
    const response = await axiosClient.post<UserResponse>(BASE_PATH, userData, config);
    return response.data;
};

/**
 * Update user information
 */
export const updateUser = async (userId: number, userData: Partial<CreateUserPayload> | FormData): Promise<UserResponse> => {
    const config = userData instanceof FormData 
        ? { 
            headers: {
                'Content-Type': 'multipart/form-data'
            } 
        } 
        : {};
        
    const response = await axiosClient.patch<UserResponse>(`${BASE_PATH}/${userId}`, userData, config);
    return response.data;
};

/**
 * Delete a user
 */
export const deleteUser = async (userId: number): Promise<UserResponse> => {
    const response = await axiosClient.delete<UserResponse>(`${BASE_PATH}/${userId}`);
    return response.data;
}; 
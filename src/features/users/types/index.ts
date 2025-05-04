import { ApiResponse, Meta } from "@/types/apiResponse.type"

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface UserRole {
  id: number;
  name: string;
}

export interface User {
  id: number;
  username: string;
  name: string;
  gender: Gender;
  address: string;
  updatedAt: string | null;
  createdAt: string;
  role: UserRole;
  avatar: string;
}

export interface UserPagination {
  meta: Meta;
  result: User[];
}

export type UserResponse = ApiResponse<UserPagination>;

export interface UserFilterParams {
  search?: string;
  roleId?: number;
  gender?: Gender;
  page?: number;
  pageSize?: number;
}

export interface CreateUserPayload {
  name: string;
  username: string;
  password: string;
  gender: Gender;
  address: string;
  roleId: number;
  avatar?: string;
}
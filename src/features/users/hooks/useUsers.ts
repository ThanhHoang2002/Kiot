import { 
  useQuery, 
  useMutation, 
  useQueryClient 
} from '@tanstack/react-query';

import { getUsers, deleteUser, updateUser, createUser } from '../apis/users';
import { User, UserFilterParams, CreateUserPayload } from '../types';
import { useUrlFilters } from './useUrlFilters';

export const useUsers = (initialFilters: UserFilterParams = {}) => {
  const queryClient = useQueryClient();
  const { 
    filters, 
    updateFilters, 
    updatePage, 
    searchTerm,
    selectedRoleId,
    selectedGender,
    updateSearch,
    updateRole,
    updateGender,
    resetFilters
  } = useUrlFilters({ initialFilters });

  // Use React Query to fetch users
  const { 
    data, 
    isLoading, 
    error, 
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['users', filters],
    queryFn: async () => {
      const response = await getUsers(filters);
      return response;
    }
  });

  // Extract users and meta from the query result
  const users = data?.data.result || [];
  const meta = data?.data.meta || { total: 0, page: 1, pageSize: 20, pages: 1 };

  // Mutation for creating a user
  const createUserMutation = useMutation({
    mutationFn: (userData: FormData | CreateUserPayload) => createUser(userData),
    onSuccess: () => {
      // Invalidate the users query to refetch
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err) => {
      console.error('Failed to create user:', err);
    }
  });

  // Mutation for deleting a user
  const deleteUserMutation = useMutation({
    mutationFn: (userId: number) => deleteUser(userId),
    onSuccess: () => {
      // Invalidate the users query to refetch
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err) => {
      console.error('Failed to delete user:', err);
    }
  });

  // Mutation for updating a user
  const updateUserMutation = useMutation({
    mutationFn: ({ userId, userData }: { userId: number, userData: Partial<User> | FormData }) => 
      updateUser(userId, userData),
    onSuccess: () => {
      // Invalidate the users query to refetch
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err) => {
      console.error('Failed to update user:', err);
    }
  });

  const handleCreateUser = async (userData: FormData | CreateUserPayload) => {
    return createUserMutation.mutateAsync(userData);
  };

  const handleDeleteUser = async (userId: number) => {
    return deleteUserMutation.mutateAsync(userId);
  };

  const handleUpdateUser = async (userId: number, userData: Partial<User> | FormData) => {
    return updateUserMutation.mutateAsync({ userId, userData });
  };

  return {
    users,
    isLoading,
    isFetching,
    error: error as Error | null,
    meta,
    filters,
    searchTerm,
    selectedRoleId,
    selectedGender,
    createUserLoading: createUserMutation.isPending,
    deleteUserLoading: deleteUserMutation.isPending,
    updateUserLoading: updateUserMutation.isPending, 
    updateFilters,
    updateSearch,
    updateRole,
    updateGender,
    updatePage,
    setPage: updatePage,
    resetFilters,
    createUser: handleCreateUser,
    deleteUser: handleDeleteUser,
    updateUser: handleUpdateUser,
    refresh: refetch
  };
}; 
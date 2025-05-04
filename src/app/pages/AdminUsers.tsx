import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { UserFilters, UserTable } from '@/features/users/components';
import AddUserButton from '@/features/users/components/AddUserButton';
import EditUserDialog from '@/features/users/components/EditUserDialog';
import { useUsers } from '@/features/users/hooks';
import { User } from '@/features/users/types';
import { useToast } from '@/hooks/use-toast';
import useAuthStore from '@/store/authStore';

const UsersPage = () => {
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const {
    users,
    isLoading,
    meta,
    filters,
    updateFilters,
    updatePage,
    updateUser,
    updateUserLoading,
    deleteUserLoading,
    createUser,
    createUserLoading,
    deleteUser
  } = useUsers({
    pageSize: 10
  });

  const handleEditUser = (user: User) => {
    setTimeout(() => {
      setUserToEdit(user);
      setIsEditDialogOpen(true);
    }, 10);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setTimeout(() => {
      setUserToEdit(null);
    }, 300);
  };

  const handleUpdateUser = async (userId: number, userData: Partial<User>) => {
    setUpdatingUserId(userId);
    try {
      await updateUser(userId, userData);
      toast({
        title: 'Thành công',
        description: 'Đã cập nhật thông tin người dùng'
      });
      
      // Kiểm tra nếu người dùng đang cập nhật là người dùng hiện tại
      const currentUser = useAuthStore.getState().currentUser;
      if (currentUser?.id === userId) {
        // Invalidate query để cập nhật thông tin người dùng trong header
        queryClient.invalidateQueries({ queryKey: ['info'] });
      }
      
      handleCloseEditDialog();
    } catch {
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật thông tin người dùng',
        variant: 'destructive'
      });
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa người dùng ${user.name}?`)) {
      try {
        await deleteUser(user.id);
        toast({
          title: 'Thành công',
          description: `Đã xóa người dùng ${user.name}`
        });
      } catch {
        toast({
          title: 'Lỗi',
          description: 'Không thể xóa người dùng. Vui lòng thử lại.',
          variant: 'destructive'
        });
      }
    }
  };

  const handleCreateUser = async (formData: FormData) => {
    try {
      await createUser(formData);
      toast({
        title: 'Thành công',
        description: 'Đã tạo người dùng mới'
      });
    } catch {
      toast({
        title: 'Lỗi',
        description: 'Không thể tạo người dùng. Vui lòng thử lại.',
        variant: 'destructive'
      });
      throw Error('Failed to create user');
    }
  };

  return (
    <div className='p-4'>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Quản lý người dùng</h1>
        <p className="mt-1 truncate text-muted-foreground">
          Xem, tìm kiếm và quản lý tài khoản người dùng trong hệ thống.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex flex-col justify-between md:flex-row"> 
          <UserFilters onFilterChange={updateFilters} initialFilters={filters} />
          <AddUserButton onCreateUser={handleCreateUser} />
        </div>
        
        <UserTable 
          users={users}
          isLoading={isLoading || updateUserLoading || deleteUserLoading || createUserLoading}
          meta={meta}
          updatingUserId={updatingUserId}
          onPageChange={updatePage}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
        />
      </div>

      {userToEdit && (
        <EditUserDialog
          user={userToEdit}
          isOpen={isEditDialogOpen}
          onClose={handleCloseEditDialog}
          onUpdate={(userData: Partial<User>) => handleUpdateUser(userToEdit.id, userData)}
          isUpdating={updatingUserId === userToEdit.id}
        />
      )}
    </div>
  );
};

export default UsersPage;

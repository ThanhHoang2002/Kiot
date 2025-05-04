import { motion } from 'motion/react';
import { memo } from 'react';

import { User } from '../types';
import UserRow from './UserRow';

import EmptyState from '@/components/ui/empty-state';
import PaginationComponent from '@/components/ui/pagination-component';
import TableSkeleton from '@/components/ui/table-skeleton';
import { Meta } from '@/types/apiResponse.type';

// Type definitions
interface UserTableProps {
  users: User[];
  isLoading: boolean;
  meta: Meta;
  updatingUserId: number | null;
  onPageChange: (page: number) => void;
  onEditUser?: (user: User) => void;
  onDeleteUser?: (user: User) => void;
}

// Header component
const TableHeader = memo(() => (
  <thead className="bg-muted/50">
    <tr>
      <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Họ tên
      </th>
      <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Username
      </th>
      <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Vai trò
      </th>
      <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Ngày tạo
      </th>
      <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Giới tính
      </th>
      <th scope="col" className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Thao tác
      </th>
    </tr>
  </thead>
));

TableHeader.displayName = 'TableHeader';

// Main component
const UserTable = memo(({ 
  users, 
  isLoading, 
  meta, 
  updatingUserId, 
  onPageChange, 
  onEditUser,
  onDeleteUser
}: UserTableProps) => {
  if (isLoading) {
    return (
      <TableSkeleton 
        columns={6}
        rows={10}
        headerTitles={['Họ tên', 'Username', 'Vai trò', 'Ngày tạo', 'Giới tính', 'Thao tác']}
      />
    );
  }

  if (users.length === 0) {
    return <EmptyState title="Không tìm thấy người dùng nào." />;
  }

  return (
    <motion.div 
      className="space-y-4" 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      transition={{ duration: 0.5 }}
    >
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-border">
          <TableHeader />
          <tbody className="divide-y divide-border bg-background">
            {users.map((user) => (
              <UserRow 
                key={user.id}
                user={user} 
                updatingUserId={updatingUserId} 
                onEditUser={onEditUser}
                onDeleteUser={onDeleteUser}
              />
            ))}
          </tbody>
        </table>
      </div>

      <PaginationComponent
        currentPage={meta.page} 
        totalItems={meta.total} 
        pageSize={meta.pageSize} 
        onPageChange={onPageChange}
        itemName="người dùng"
      />
    </motion.div>
  );
});

UserTable.displayName = 'UserTable';
export default UserTable; 
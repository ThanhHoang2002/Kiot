import { memo } from 'react';

import { User } from '../types';
import UserActionButton from './UserActionButton';
import UserRoleBadge from './UserRoleBadge';

// Utility function for date formatting
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export interface UserRowProps {
  user: User;
  updatingUserId: number | null;
  onEditUser?: (user: User) => void;
  onDeleteUser?: (user: User) => void;
}

const UserRow = memo(({ 
  user, 
  updatingUserId, 
  onEditUser,
  onDeleteUser 
}: UserRowProps) => (
  <tr className="hover:bg-muted/50">
    <td className="whitespace-nowrap px-4 py-4">
      <div className="flex items-center gap-2">
        {user.avatar && (
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="h-8 w-8 rounded-full object-cover"
          />
        )}
        <span className="font-medium">{user.name}</span>
      </div>
    </td>
    <td className="whitespace-nowrap px-4 py-4">{user.username}</td>
    <td className="whitespace-nowrap px-4 py-4">
      <UserRoleBadge role={user.role.name} />
    </td>
    <td className="whitespace-nowrap px-4 py-4">
      {formatDate(user.createdAt)}
    </td>
    <td className="whitespace-nowrap px-4 py-4">
      <span className="inline-flex h-6 items-center rounded-md bg-primary/10 px-2 text-xs font-medium text-primary">
        {user.gender}
      </span>
    </td>
    <td className="whitespace-nowrap px-4 py-4 text-right">
      <UserActionButton 
        user={user} 
        isUpdating={updatingUserId === user.id} 
        onEdit={onEditUser}
        onDelete={onDeleteUser}
      />
    </td>
  </tr>
));

UserRow.displayName = 'UserRow';
export default UserRow; 
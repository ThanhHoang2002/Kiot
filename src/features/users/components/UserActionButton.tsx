import { Edit, MoreVertical } from 'lucide-react';
import { memo, useState } from 'react';

import { User } from '../types';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface UserActionButtonProps {
  user: User;
  isUpdating: boolean;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
}  

export const UserActionButton = memo(({ 
  user, 
  isUpdating,
  onEdit = () => {}, 
}: UserActionButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleEdit = () => {
    setIsOpen(false); // Đóng dropdown trước
    // Đợi một tick để đảm bảo dropdown đã đóng hoàn toàn
    setTimeout(() => {
      onEdit(user);
    }, 10);
  };
  
  // const handleDelete = () => {
  //   setIsOpen(false); // Đóng dropdown trước
  //   // Đợi một tick để đảm bảo dropdown đã đóng hoàn toàn
  //   setTimeout(() => {
  //     onDelete(user);
  //   }, 10);
  // };
  
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 data-[state=open]:bg-muted"
          disabled={isUpdating}
        >
          {isUpdating ? (
            <div className="flex items-center justify-center">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          ) : (
            <MoreVertical className="h-4 w-4" />
          )}
          <span className="sr-only">Tùy chọn</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="cursor-pointer transition-colors hover:bg-muted" onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Chỉnh sửa
        </DropdownMenuItem>
        {/* <DropdownMenuItem 
          className="cursor-pointer text-destructive transition-colors hover:bg-destructive/10"
          onClick={handleDelete}
        >
          <Trash className="mr-2 h-4 w-4" />
          Xóa tài khoản
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

UserActionButton.displayName = 'UserActionButton';
export default UserActionButton; 
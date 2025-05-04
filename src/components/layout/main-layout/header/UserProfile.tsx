import { LogOut, Settings, UserCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from '@/components/ui/image'
import useAuthStore from '@/store/authStore'

const UserProfile = () => {
  const { clearCurrentUser} = useAuthStore()
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}').user;

  const navigate = useNavigate()
  
  const handleLogout = () => {
    // Xóa token khỏi localStorage
    localStorage.removeItem('accessToken')
    
    // Xóa currentUser khỏi store và localStorage
    clearCurrentUser()
    
    // Chuyển hướng về trang login
    navigate('/login')
  }
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center gap-2 px-4">
        <UserCircle2 className="h-8 w-8 text-gray-300" />
        <p className="text-sm font-medium text-gray-300">Chưa đăng nhập</p>
      </div>
    )
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <div className="flex cursor-pointer items-center justify-center gap-2 rounded-full px-3 py-1 hover:bg-white/10">
          <div className="overflow-hidden rounded-full">
            <Image 
              src={currentUser.avatar} 
              containerClassName="h-8 w-8 rounded-full"
              fallback={<UserCircle2 className="h-8 w-8 text-gray-300" />}
              alt={currentUser.username}
            />
          </div>
          <p className="max-w-[120px] truncate text-sm font-medium">
            {currentUser.name || currentUser.username}
          </p>
        </div>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center gap-2 p-2">
          <div className="overflow-hidden rounded-full">
            <Image 
              src={currentUser.avatar} 
              containerClassName="h-10 w-10 rounded-full"
              fallback={<UserCircle2 className="h-10 w-10 text-gray-400" />}
              alt={currentUser.name}
            />
          </div>
          <div className="flex flex-col">
            <p className="font-medium">{currentUser.name}</p>
            <p className="text-xs text-muted-foreground">{currentUser?.role?.name}</p>
          </div>
        </div>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          className="cursor-pointer gap-2" 
          onClick={() => navigate('/profile')}
        >
          <Settings className="h-4 w-4" />
          <span>Thông tin cá nhân</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className="cursor-pointer gap-2 text-red-500 focus:text-red-500" 
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserProfile
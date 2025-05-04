import { CalendarDays, Mail, Map, User as UserIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Image from '@/components/ui/image';
import { User } from '@/features/users/types';

// Map role ID to display name and color
const roleConfig: Record<number, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  1: { label: 'Quản trị viên', variant: 'default' },
  2: { label: 'Nhân viên', variant: 'secondary' },
};

// Map gender to display text
const genderLabels: Record<string, string> = {
  'MALE': 'Nam',
  'FEMALE': 'Nữ',
  'OTHER': 'Khác',
};

interface UserProfileCardProps {
  user: User;
}

export const UserProfileCard = ({ user }: UserProfileCardProps) => {
  const roleId = user.role?.id || 0;
  const roleInfo = roleConfig[roleId] || { label: 'Không xác định', variant: 'outline' };
  
  return (
    <Card className="overflow-hidden">
      <div className="h-32 bg-gradient-to-r from-primary to-primary/60"></div>
      <CardHeader className="relative mt-[-4rem] flex items-center pb-4">
        <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-background bg-background">
          <Image
            src={user.avatar}
            alt={user.name}
            containerClassName="h-full w-full"
            fallback={<UserIcon className="h-full w-full p-4 text-muted-foreground" />}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <div className="flex items-center gap-2">
            <Badge variant={roleInfo.variant}>{roleInfo.label}</Badge>
            <span className="text-sm text-muted-foreground">@{user.username}</span>
          </div>
        </div>
        
        <div className="grid gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{user.username}</span>
          </div>
          {user.gender && (
            <div className="flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-muted-foreground" />
              <span>{genderLabels[user.gender] || user.gender}</span>
            </div>
          )}
          {user.address && (
            <div className="flex items-center gap-2">
              <Map className="h-4 w-4 text-muted-foreground" />
              <span>{user.address}</span>
            </div>
          )}
          {user.createdAt && (
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span>
                Tham gia ngày {new Date(user.createdAt).toLocaleDateString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit', 
                  year: 'numeric'
                })}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 
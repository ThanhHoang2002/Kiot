import { User } from '../types';

import { STATUS, STATUS_DISPLAY } from '@/constant/status';

interface UserStatusBadgeProps {
  status: User['isActive'];
}

const UserStatusBadge = ({ status }: UserStatusBadgeProps) => {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        status
          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500'
          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500'
      }`}
    >
      <span className={`mr-1 h-1.5 w-1.5 rounded-full ${
        status ? 'bg-green-500' : 'bg-red-500'
      }`} />
      {
        STATUS_DISPLAY[status ? STATUS.ACTIVE : STATUS.INACTIVE]
      }
    </span>
  );
};

export default UserStatusBadge; 
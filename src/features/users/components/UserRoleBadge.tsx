import { ROLES, ROLES_DISPLAY } from "@/constant/role";

interface UserRoleBadgeProps {
  role: string;
}

const UserRoleBadge = ({ role }: UserRoleBadgeProps) => {
  const getBadgeStyles = (role: string) => {
    switch (role) {
      case ROLES.ADMIN:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-500';
      case ROLES.EMPLOYEE:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-500';
    }
  };

  const displayText = ROLES_DISPLAY[role as keyof typeof ROLES_DISPLAY] || role;

  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getBadgeStyles(role)}`}
    >
      {displayText}
    </span>
  );
};

export default UserRoleBadge; 
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { UserUpdateValues, userUpdateSchema } from "../schemas/user-form.schema";
import { User } from "../types";

interface UseEditUserFormProps {
  user: User;
}

export const useEditUserForm = ({ user }: UseEditUserFormProps) => {
  return useForm<UserUpdateValues>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      name: user.name,
      username: user.username,
      gender: user.gender,
      address: user.address,
      roleId: user.role.id,
      avatar: user.avatar,
      password: '',
      confirmPassword: ''
    },
  });   
}; 
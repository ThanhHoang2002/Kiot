import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { UserFormValues, userFormSchema } from "../schemas/user-form.schema";

export const useAddUserForm = () => {
  return useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      username: '',
      password: '',
      confirmPassword: '',
      gender: 'MALE',
      address: '',
      roleId: 1,
      avatar: ''
    },
  });   
};



import { z } from "zod";

const baseUserSchema = z.object({
  name: z.string().min(2, { message: 'Tên phải có ít nhất 2 ký tự' }),
  username: z.string().min(3, { message: 'Username phải có ít nhất 3 ký tự' }),
  email: z.string().email({ message: 'Email không hợp lệ' }).optional().or(z.literal('')),
  phoneNumber: z
    .string()
    .regex(/^(0|\+84)[0-9]{9,10}$/, { message: 'Số điện thoại không hợp lệ' })
    .or(z.literal('')),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER'] as const, {
    errorMap: () => ({ message: 'Vui lòng chọn giới tính' })
  }),
  address: z.string().min(2, { message: 'Địa chỉ phải có ít nhất 2 ký tự' }),
  roleId: z.number({ 
    required_error: 'Vui lòng chọn vai trò',
    invalid_type_error: 'Vai trò phải là một số' 
  }),
  avatar: z.string().optional(),
});

export const userFormSchema = baseUserSchema.extend({
  password: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword']
});
  
export type UserFormValues = z.infer<typeof userFormSchema>;

// Schema cho việc cập nhật user (không yêu cầu password)
export const userUpdateSchema = baseUserSchema.extend({
  password: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }).optional(),
  confirmPassword: z.string().optional(),
}).refine(
  (data: z.infer<typeof baseUserSchema> & { password?: string; confirmPassword?: string }) => 
    !data.password || data.password === data.confirmPassword,
  {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword']
  }
);

export type UserUpdateValues = z.infer<typeof userUpdateSchema>;
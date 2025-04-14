// forms/LoginForm/login.schema.ts
import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Username không hợp lệ"),
  password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

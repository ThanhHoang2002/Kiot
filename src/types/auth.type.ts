export interface Role {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}
export interface User {
  id: number;
  username: string;
  name: string;
  avatar: string;
  role: Role;
}
export interface LoginResponseData {
  user: User;
  access_token: string;
  refresh_token: string;
}

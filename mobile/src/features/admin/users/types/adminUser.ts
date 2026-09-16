export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  createdAt: string;
}

export interface AdminUsersResponse {
  success: boolean;
  users: AdminUser[];
}

export interface AdminUserResponse {
  success: boolean;
  user: AdminUser;
}

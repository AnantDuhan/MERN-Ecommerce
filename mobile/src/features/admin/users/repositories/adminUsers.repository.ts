import { api } from "@/api/axios";
import { API_ENDPOINTS } from "@/api/endpoints";
import { AdminUser, AdminUserResponse, AdminUsersResponse } from "../types/adminUser";

export class AdminUsersRepository {
  static async list(): Promise<AdminUser[]> {
    const { data } = await api.get<AdminUsersResponse>(API_ENDPOINTS.ADMIN.USERS);
    return data.users;
  }

  static async detail(id: string): Promise<AdminUser> {
    const { data } = await api.get<AdminUserResponse>(API_ENDPOINTS.ADMIN.USER_DETAIL(id));
    return data.user;
  }

  static async updateRole(
    id: string,
    payload: { name: string; email: string; role: string }
  ): Promise<AdminUser> {
    const { data } = await api.put<AdminUserResponse>(
      API_ENDPOINTS.ADMIN.USER_ROLE_UPDATE(id),
      payload
    );
    return data.user;
  }

  static async remove(id: string): Promise<void> {
    await api.delete(API_ENDPOINTS.ADMIN.USER_DELETE(id));
  }
}

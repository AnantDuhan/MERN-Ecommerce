import { api } from "@/api/axios";
import { API_ENDPOINTS } from "@/api/endpoints";
import { LoginRequest, LoginResponse } from "../types/login";
import { RegisterRequest, RegisterResponse } from "../types/register";
import {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
} from "../types/forgot-password";
import {
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "../types/reset-password";
import { toRegisterFormData } from "../mappers/register.mapper";
import { User } from "../types/user";

interface MeResponse {
  success: boolean;
  user: User;
}

export interface CurrentUserResponse {
  success: boolean;
  user: User;
}

export class AuthRepository {
  static async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      data,
    );

    return response.data;
  }

  static async register(data: RegisterRequest): Promise<RegisterResponse> {
    const formData = toRegisterFormData(data);

    const response = await api.post<RegisterResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  }

  static async logout(): Promise<void> {
    await api.post(API_ENDPOINTS.AUTH.LOGOUT);
  }

  static async forgotPassword(
    data: ForgotPasswordRequest,
  ): Promise<ForgotPasswordResponse> {
    const response = await api.post<ForgotPasswordResponse>(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      data,
    );

    return response.data;
  }

  static async resetPassword(
    request: ResetPasswordRequest
  ): Promise<ResetPasswordResponse> {
    const { token, ...body } = request;

    const { data } = await api.put<ResetPasswordResponse>(
      `${API_ENDPOINTS.AUTH.RESET_PASSWORD}/${token}`,
      body
    );

    return data;
  }

  static async me(): Promise<MeResponse> {
    const response = await api.get<MeResponse>(API_ENDPOINTS.AUTH.ME);

    return response.data;
  }

  static async getCurrentUser(): Promise<CurrentUserResponse> {
    const response = await api.get<CurrentUserResponse>(API_ENDPOINTS.AUTH.ME);

    return response.data;
  }
}

import { InternalAxiosRequestConfig, AxiosError } from "axios";
import { SecureStorageService } from "@/services/secure-storage.service";

export async function requestInterceptor(
  config: InternalAxiosRequestConfig
) {
  const token = await SecureStorageService.getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}

export function requestErrorInterceptor(error: AxiosError) {
  return Promise.reject(error);
}

export function responseInterceptor(response: any) {
  return response;
}

export async function responseErrorInterceptor(error: AxiosError) {
  if (error.response?.status === 401) {
    // TODO
    // Refresh Token

    // or

    // Logout user
  }

  return Promise.reject(error);
}
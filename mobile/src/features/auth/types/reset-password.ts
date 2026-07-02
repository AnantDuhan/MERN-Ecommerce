export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
}
import { User } from "./user";
import { ImagePickerAsset } from "expo-image-picker";

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  whatsappNumber?: string;
  image: ImagePickerAsset;
}

export interface RegisterResponse {
  success: boolean;
  token: string;
  user: User;
}
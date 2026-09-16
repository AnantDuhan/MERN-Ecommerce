import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "access_token";

export class SecureStorageService {
  static async set(key: string, value: string): Promise<void> {
    await SecureStore.setItemAsync(key, value);
  }

  static async get(key: string): Promise<string | null> {
    return SecureStore.getItemAsync(key);
  }

  static async remove(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(key);
  }

  static async clear(): Promise<void> {
    await this.remove(ACCESS_TOKEN_KEY);
  }

  static async saveToken(token: string): Promise<void> {
    await this.set(ACCESS_TOKEN_KEY, token);
  }

  static async getToken(): Promise<string | null> {
    return this.get(ACCESS_TOKEN_KEY);
  }

  static async removeToken(): Promise<void> {
    await this.remove(ACCESS_TOKEN_KEY);
  }

  static async hasToken(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }
}
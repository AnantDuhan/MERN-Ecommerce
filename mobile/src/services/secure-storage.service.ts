import * as SecureStore from "expo-secure-store";

export class SecureStorageService {
  static async set(key: string, value: string) {
    await SecureStore.setItemAsync(key, value);
  }

  static async get(key: string) {
    return SecureStore.getItemAsync(key);
  }

  static async remove(key: string) {
    await SecureStore.deleteItemAsync(key);
  }

  static async saveToken(token: string) {
    return this.set("access_token", token);
  }

  static async getToken() {
    return this.get("access_token");
  }

  static async removeToken() {
    return this.remove("access_token");
  }
}
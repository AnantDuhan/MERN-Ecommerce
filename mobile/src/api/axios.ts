import axios from "axios";
import Constants from "expo-constants";
import {
  requestInterceptor,
  requestErrorInterceptor,
  responseInterceptor,
  responseErrorInterceptor,
} from "./interceptors";

/**
 * Resolve the backend base URL, in priority order:
 *  1. EXPO_PUBLIC_BACKEND_URL / EXPO_PUBLIC_API_URL — explicit override.
 *  2. Local dev auto-detect — if Metro is serving from a LAN host (Expo Go /
 *     dev client), hit that same machine's backend on API_PORT. Useful when
 *     running the backend locally alongside `expo start`.
 *  3. The deployed backend — safe default so the app works out of the box
 *     without any local server running.
 */
const API_PORT = 8080; // matches backend/server.js: process.env.PORT || 8080
const DEPLOYED_BASE_URL = "https://mern-ecommerce-7ojo.onrender.com/api/v1";

function resolveBaseUrl(): string {
  const override =
    process.env.EXPO_PUBLIC_BACKEND_URL || process.env.EXPO_PUBLIC_API_URL;
  if (override) return override;

  const hostUri =
    Constants.expoConfig?.hostUri ??
    (Constants as any)?.expoGoConfig?.hostUri ??
    (Constants as any)?.manifest2?.extra?.expoClient?.hostUri;

  if (hostUri) {
    const host = String(hostUri).split(":")[0];
    return `http://${host}:${API_PORT}/api/v1`;
  }

  return DEPLOYED_BASE_URL;
}

export const api = axios.create({
  baseURL: resolveBaseUrl(),
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(requestInterceptor, requestErrorInterceptor);
api.interceptors.response.use(responseInterceptor, responseErrorInterceptor);

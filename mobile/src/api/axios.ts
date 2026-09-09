import axios from "axios";
import Constants from "expo-constants";
import {
  requestInterceptor,
  requestErrorInterceptor,
  responseInterceptor,
  responseErrorInterceptor,
} from "./interceptors";

/**
 * Resolve the backend host automatically.
 * In dev, Expo exposes the Metro host (your machine's LAN IP) via hostUri,
 * so a phone / emulator hits the same machine that serves the bundle.
 * Falls back to localhost, and can be overridden with EXPO_PUBLIC_API_URL.
 */
const API_PORT = 4000;

function resolveBaseUrl(): string {
  const override = process.env.EXPO_PUBLIC_API_URL;
  if (override) return override;

  const hostUri =
    Constants.expoConfig?.hostUri ??
    (Constants as any)?.expoGoConfig?.hostUri ??
    (Constants as any)?.manifest2?.extra?.expoClient?.hostUri;

  const host = hostUri ? String(hostUri).split(":")[0] : "localhost";
  return `http://${host}:${API_PORT}/api/v1`;
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

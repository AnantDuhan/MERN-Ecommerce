import axios from "axios";
import {
  requestInterceptor,
  requestErrorInterceptor,
  responseInterceptor,
  responseErrorInterceptor,
} from "./interceptors";

// Local backend for development.
// Override with EXPO_PUBLIC_API_URL (e.g. in mobile/.env) if this device
// can't reach "localhost" directly — Android emulator needs 10.0.2.2,
// and a physical device needs your machine's LAN IP instead.
const DEFAULT_BASE_URL = "http://localhost:4000/api/v1";

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || DEFAULT_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(requestInterceptor, requestErrorInterceptor);
api.interceptors.response.use(responseInterceptor, responseErrorInterceptor);

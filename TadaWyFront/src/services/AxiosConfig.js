// services/axiosConfig.ts
import axios from "axios";
import { ENV } from "@/config/env";
import { TokenService } from "./tokenService";
/**
 * ===============================
 * Axios Instance
 * ===============================
 */
const axiosInstance = axios.create({
  baseURL: ENV.API_URL,
  timeout: ENV.API_TIMEOUT ?? 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
/**
 * ===============================
 * Request Interceptor
 * ===============================
 * - Attach access token if exists
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = TokenService.getToken();
    config.headers = config.headers || {};

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);
export default axiosInstance;
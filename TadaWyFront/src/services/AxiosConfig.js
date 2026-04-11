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

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = TokenService.getRefreshToken() || localStorage.getItem("refreshToken");

      if (!refreshToken) {
        processQueue(new Error("No refresh token available"));
        TokenService.removeToken();
        localStorage.removeItem("userToken");
        localStorage.removeItem("refreshToken");
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${ENV.API_URL}/Auth/RefreshToken`, {
          token: TokenService.getToken() || localStorage.getItem("userToken"),
          refreshToken: refreshToken
        });
        
        const { token, refreshToken: newRefreshToken } = response.data;
        
        TokenService.setToken(token, newRefreshToken);
        localStorage.setItem("userToken", token);
        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }
        
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
        originalRequest.headers.Authorization = `Bearer ${token}`;
        
        processQueue(null, token);
        
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        TokenService.removeToken();
        localStorage.removeItem("userToken");
        localStorage.removeItem("refreshToken");
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
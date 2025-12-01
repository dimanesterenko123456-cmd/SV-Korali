// src/axiosConfig/api.js
import axios from "axios";

const API_BASE_URL =
  typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL;

export const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const setAuthHeader = (accessToken) => {
  if (!accessToken) return;

  API.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  localStorage.setItem("accessToken", accessToken);
};

export const clearAuthHeader = () => {
  delete API.defaults.headers.common.Authorization;
  localStorage.removeItem("accessToken");
};

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalConfig = error.config;

    const status = error.response?.status;

    if (
      status === 401 &&
      !originalConfig._retry &&
      !originalConfig.url.includes("/auth/refresh")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            if (newToken) {
              originalConfig.headers.Authorization = `Bearer ${newToken}`;
            }
            return API(originalConfig);
          })
          .catch((err) => Promise.reject(err));
      }

      originalConfig._retry = true;
      isRefreshing = true;

      try {
        const { data } = await API.post("/auth/refresh");
        const newAccessToken = data?.data?.accessToken;

        if (newAccessToken) {
          setAuthHeader(newAccessToken);
          processQueue(null, newAccessToken);
          originalConfig.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        return API(originalConfig);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAuthHeader();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

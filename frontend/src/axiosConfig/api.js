// src/axiosConfig/api.js
import axios from "axios";

const API_BASE_URL =
  typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL;

export const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const setAuthHeader = (accessToken) => {
  if (!accessToken) {
    return;
  }

  API.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  localStorage.setItem("accessToken", accessToken);
};

export const clearAuthHeader = () => {
  delete API.defaults.headers.common.Authorization;
  localStorage.removeItem("accessToken");
};

// додаємо токен з localStorage у кожен запит
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

let refreshPromise = null;

const refreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = API.post("/auth/refresh")
      .then(({ data }) => {
        const accessToken = data?.data?.accessToken;

        if (!accessToken) {
          throw new Error("Unable to refresh the session");
        }

        setAuthHeader(accessToken);
        return accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;
    const requestUrl = originalRequest?.url || "";

    const shouldRefresh =
      error?.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !requestUrl.includes("/auth/refresh") &&
      !requestUrl.includes("/auth/login") &&
      !requestUrl.includes("/auth/register") &&
      !requestUrl.includes("/auth/logout");

    if (!shouldRefresh) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const accessToken = await refreshAccessToken();
      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      return API(originalRequest);
    } catch (refreshError) {
      clearAuthHeader();
      return Promise.reject(refreshError);
    }
  },
);

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
    console.warn("setAuthHeader called with empty token:", accessToken);
    return;
  }

  API.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  localStorage.setItem("accessToken", accessToken);

  console.log(" setAuthHeader: ", API.defaults.headers.common.Authorization);
};

export const clearAuthHeader = () => {
  delete API.defaults.headers.common.Authorization;
  localStorage.removeItem("accessToken");
  console.log("clearAuthHeader");
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

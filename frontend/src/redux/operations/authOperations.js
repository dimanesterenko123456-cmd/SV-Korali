// src/redux/operations/authOperations.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { API, setAuthHeader, clearAuthHeader } from "../../axiosConfig/api";

const handleError = (error, thunkAPI) => {
  const message =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error.message ||
    "Something went wrong";
  return thunkAPI.rejectWithValue(message);
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async (credentials, thunkAPI) => {
    try {
      const { data } = await API.post("/auth/register", credentials);
      return data;
    } catch (error) {
      return handleError(error, thunkAPI);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const { data } = await API.post("/auth/login", credentials);
      const accessToken = data?.data?.accessToken;

      if (accessToken) {
        setAuthHeader(accessToken);
      }

      return { accessToken };
    } catch (error) {
      return handleError(error, thunkAPI);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      await API.post("/auth/logout");
      clearAuthHeader();
      return;
    } catch (error) {
      return handleError(error, thunkAPI);
    }
  }
);

export const refreshSession = createAsyncThunk(
  "auth/refreshSession",
  async (_, thunkAPI) => {
    try {
      const { data } = await API.post("/auth/refresh");
      const accessToken = data?.data?.accessToken;

      if (accessToken) {
        setAuthHeader(accessToken);
      }

      return { accessToken };
    } catch (error) {
      clearAuthHeader();
      return handleError(error, thunkAPI);
    }
  }
);

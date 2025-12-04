// src/redux/operations/authOperations.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { API, clearAuthHeader, setAuthHeader } from "../../axiosConfig/api.js";

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error.message ||
  "Something went wrong";

// REGISTER
export const registerUserThunk = createAsyncThunk(
  "auth/registerUser",
  async (credentials, thunkApi) => {
    try {
      const response = await API.post("/auth/register", credentials);

      return response.data.data; // user
    } catch (error) {
      return thunkApi.rejectWithValue(getErrorMessage(error));
    }
  }
);

// LOGIN
export const loginUserThunk = createAsyncThunk(
  "auth/loginUser",
  async (credentials, thunkApi) => {
    try {
      const response = await API.post("/auth/login", credentials);
      const data = response.data.data;
      const accessToken = data.accessToken;

      if (accessToken) {
        setAuthHeader(accessToken);
      }

      return { accessToken };
    } catch (error) {
      return thunkApi.rejectWithValue(getErrorMessage(error));
    }
  }
);

// CURRENT USER (role client/admin)
export const fetchCurrentUserThunk = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, thunkApi) => {
    try {
      const response = await API.get("/auth/current");
      // бек: { status, message, data: user }
      return response.data.data; // user
    } catch (error) {
      if (error?.response?.status === 401) {
        clearAuthHeader();
      }
      return thunkApi.rejectWithValue(getErrorMessage(error));
    }
  }
);

// LOGOUT
export const logoutUserThunk = createAsyncThunk(
  "auth/logoutUser",
  async (_, thunkAPI) => {
    try {
      await API.post("/auth/logout");
      clearAuthHeader();
      return;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

// REFRESH
export const refreshUserThunk = createAsyncThunk(
  "auth/refreshUser",
  async (_, thunkAPI) => {
    try {
      const response = await API.post("/auth/refresh");
      const data = response.data.data; // { accessToken }
      const accessToken = data.accessToken;

      if (accessToken) {
        setAuthHeader(accessToken);
      }

      return { accessToken };
    } catch (error) {
      clearAuthHeader();
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

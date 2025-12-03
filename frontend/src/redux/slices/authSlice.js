// src/redux/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  loginUserThunk,
  logoutUserThunk,
  refreshUserThunk,
  registerUserThunk,
  fetchCurrentUserThunk,
  debugThunk,
} from "../operations/authOperations";

const tokenFromStorage =
  typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

const initialState = {
  accessToken: tokenFromStorage || null,
  user: null,
  isRefreshing: false,
  isLoading: false,
  error: null,
};

const authReducer = createSlice({
  name: "auth",
  initialState,
  extraReducers: (builder) =>
    builder
      // ручне оновлення токена, якщо десь захочеш диспатчити
      .addCase("auth/updateToken", (state, action) => {
        state.accessToken = action.payload.accessToken;
      })

      // LOGOUT
      .addCase(logoutUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUserThunk.fulfilled, () => {
        return {
          accessToken: null,
          user: null,
          isRefreshing: false,
          isLoading: false,
          error: null,
        };
      })
      .addCase(logoutUserThunk.rejected, (state, { payload }) => {
        state.error = payload;
        return {
          accessToken: null,
          user: null,
          isRefreshing: false,
          isLoading: false,
          error: payload,
        };
      })

      // REFRESH
      .addCase(refreshUserThunk.pending, (state) => {
        state.isRefreshing = true;
        state.isLoading = true;
      })
      .addCase(refreshUserThunk.fulfilled, (state, { payload }) => {
        state.isRefreshing = false;
        state.isLoading = false;
        if (payload?.accessToken) {
          state.accessToken = payload.accessToken;
        }
      })
      .addCase(refreshUserThunk.rejected, (state, { payload }) => {
        state.isRefreshing = false;
        state.isLoading = false;
        state.accessToken = null;
        state.user = null;
        state.error = payload;
      })

      // REGISTER
      .addCase(registerUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUserThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerUserThunk.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })

      // LOGIN
      .addCase(loginUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, { payload }) => {
        state.accessToken = payload.accessToken;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(loginUserThunk.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.accessToken = null;
        state.error = payload;
      })

      // FETCH CURRENT USER
      .addCase(fetchCurrentUserThunk.pending, (state) => {
        state.isRefreshing = true;
        state.error = null;
      })
      .addCase(fetchCurrentUserThunk.fulfilled, (state, { payload }) => {
        state.isRefreshing = false;
        state.user = payload;
      })
      .addCase(fetchCurrentUserThunk.rejected, (state, { payload }) => {
        state.isRefreshing = false;
        state.user = null;
        state.error = payload;
      })
      .addCase(debugThunk.fulfilled, (state, { payload }) => {
        state.lastDebug = payload;
      }),
});

export default authReducer.reducer;

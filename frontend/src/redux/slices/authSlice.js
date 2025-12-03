// src/redux/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshSession,
} from "../operations/authOperations";

const tokenFromStorage =
  typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

const initialState = {
  accessToken: tokenFromStorage || null,
  isLoggedIn: Boolean(tokenFromStorage),
  isLoading: false,
  isRefreshing: false,
  error: null,
};

const authReducer = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      });

    // login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accessToken = action.payload?.accessToken || null;
        state.isLoggedIn = Boolean(state.accessToken);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.accessToken = null;
        state.isLoggedIn = false;
        state.error = action.payload || action.error.message;
      });

    // logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, () => ({
        ...initialState,
        accessToken: null,
        isLoggedIn: false,
      }))
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      });

    // refresh
    builder
      .addCase(refreshSession.pending, (state) => {
        state.isRefreshing = true;
        state.error = null;
      })
      .addCase(refreshSession.fulfilled, (state, action) => {
        state.isRefreshing = false;
        state.accessToken = action.payload?.accessToken || null;
        state.isLoggedIn = Boolean(state.accessToken);
      })
      .addCase(refreshSession.rejected, (state, action) => {
        state.isRefreshing = false;
        state.accessToken = null;
        state.isLoggedIn = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default authReducer.reducer;

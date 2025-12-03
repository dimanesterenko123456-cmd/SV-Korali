// src/redux/selectors/authSelectors.js

export const selectAccessToken = (state) => state.auth.accessToken;
export const selectIsLoggedIn = (state) => Boolean(state.auth.accessToken);
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthRefreshing = (state) => state.auth.isRefreshing;
export const selectAuthError = (state) => state.auth.error;

export const selectUser = (state) => state.auth.user;
export const selectUserRole = (state) => state.auth.user?.role || "client";

// src/redux/selectors/authSelectors.js

export const selectAccessToken = (state) => state.auth.accessToken;
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthRefreshing = (state) => state.auth.isRefreshing;
export const selectAuthError = (state) => state.auth.error;

// src/redux/selectors/cartSelectors.js
export const selectCartItems = (state) => state.cart?.items || [];
export const selectCartCount = (state) => state.cart?.itemsCount || 0;
export const selectCartUserKey = (state) => state.cart?.userKey || "guest";

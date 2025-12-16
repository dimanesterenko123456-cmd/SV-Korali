// src/redux/store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { setAuthHeader } from "../axiosConfig/api";
import authReducer from "./slices/authSlice.js";
import productsReducer from "./slices/productSlice.js";
import cartReducer from "./slices/cartSlice.js";

const persistedToken =
  typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

if (persistedToken) {
  setAuthHeader(persistedToken);
}

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  products: productsReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: true,
});

export const persistor = persistStore(store);

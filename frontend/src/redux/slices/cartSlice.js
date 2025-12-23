// src/redux/slices/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCurrentUserThunk,
  logoutUserThunk,
} from "../operations/authOperations";

const isBrowser = typeof window !== "undefined";

const getUserKey = (user) => user?._id || user?.id || user?.email || "guest";
const getItemId = (item) =>
  item?._id || item?.id || item?.productId || item?.sku;

const getStorageKey = (userKey) => `cart_${userKey}`;

const loadCartItems = (userKey) => {
  if (!isBrowser) return [];

  try {
    const raw = localStorage.getItem(getStorageKey(userKey));
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("Failed to load cart from storage", error);
    return [];
  }
};

const saveCartItems = (userKey, items) => {
  if (!isBrowser) return;

  try {
    localStorage.setItem(getStorageKey(userKey), JSON.stringify(items));
  } catch (error) {
    console.error("Failed to save cart to storage", error);
  }
};

const countItems = (items) =>
  items.reduce((acc, item) => acc + (Number(item?.quantity) || 1), 0);

const normalizeQuantity = (value) => {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) return 1;
  return Math.floor(num);
};

const mergeItems = (baseItems, incomingItems) => {
  const mergedMap = new Map();

  [...baseItems, ...incomingItems].forEach((item) => {
    const id = getItemId(item);
    if (!id) return;

    const qty = Number(item?.quantity) || 1;
    const existing = mergedMap.get(id);

    if (existing) {
      mergedMap.set(id, { ...existing, quantity: existing.quantity + qty });
    } else {
      mergedMap.set(id, { ...item, quantity: qty });
    }
  });

  return Array.from(mergedMap.values());
};

const defaultUserKey = "guest";
const initialItems = loadCartItems(defaultUserKey);

const initialState = {
  userKey: defaultUserKey,
  items: initialItems,
  itemsCount: countItems(initialItems),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, { payload }) {
      const id = getItemId(payload);
      if (!id) return state;
      const incomingQty = normalizeQuantity(payload?.quantity);
      const existing = state.items.find((item) => getItemId(item) === id);

      if (existing) {
        existing.quantity = (Number(existing.quantity) || 1) + incomingQty;
      } else {
        state.items.push({ ...payload, quantity: incomingQty });
      }

      state.itemsCount = countItems(state.items);
      saveCartItems(state.userKey, state.items);
    },
    increaseQuantity(state, { payload }) {
      const id = payload;
      const existing = state.items.find((item) => getItemId(item) === id);

      if (!existing) return;

      existing.quantity = (Number(existing.quantity) || 1) + 1;
      state.itemsCount = countItems(state.items);
      saveCartItems(state.userKey, state.items);
    },
    decreaseQuantity(state, { payload }) {
      const id = payload;
      const existing = state.items.find((item) => getItemId(item) === id);

      if (!existing) return;

      const nextQty = (Number(existing.quantity) || 1) - 1;
      if (nextQty <= 0) {
        state.items = state.items.filter((item) => getItemId(item) !== id);
      } else {
        existing.quantity = nextQty;
      }

      state.itemsCount = countItems(state.items);
      saveCartItems(state.userKey, state.items);
    },
    removeFromCart(state, { payload }) {
      const id = payload;
      state.items = state.items.filter((item) => getItemId(item) !== id);
      state.itemsCount = countItems(state.items);
      saveCartItems(state.userKey, state.items);
    },
    clearCart(state) {
      state.items = [];
      state.itemsCount = 0;
      saveCartItems(state.userKey, state.items);
    },
    setCartUser(state, { payload }) {
      const userKey = payload || defaultUserKey;
      const storedItems = loadCartItems(userKey);
      state.userKey = userKey;
      state.items = storedItems;
      state.itemsCount = countItems(storedItems);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCurrentUserThunk.fulfilled, (state, { payload }) => {
      const userKey = getUserKey(payload);
      const storedItems = loadCartItems(userKey);

      const itemsToMerge = state.userKey === defaultUserKey ? state.items : [];
      const mergedItems = mergeItems(storedItems, itemsToMerge);

      state.userKey = userKey;
      state.items = mergedItems;
      state.itemsCount = countItems(mergedItems);

      saveCartItems(userKey, mergedItems);
    });

    builder.addCase(logoutUserThunk.fulfilled, (state) => {
      const guestItems = loadCartItems(defaultUserKey);
      state.userKey = defaultUserKey;
      state.items = guestItems;
      state.itemsCount = countItems(guestItems);
    });
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
  setCartUser,
} = cartSlice.actions;

export default cartSlice.reducer;

// src/redux/slices/productsSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  createProductThunk,
  deleteProductThunk,
  fetchMaxProductPriceThunk,
  fetchProductByIdThunk,
  fetchProductsThunk,
  updateProductThunk,
} from "../operations/productOperations";

const initialState = {
  items: [],
  currentProduct: null,
  count: 0,
  page: 1,
  perPage: 10,
  totalPages: 1,
  hasNextPage: false,
  hasPrevPage: false,
  isLoading: false,
  error: null,
  currentRequestId: undefined,
  maxPrice: 0,
  maxPriceLoading: false,
  maxPriceError: null,
};

const productsReducer = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearCurrentProduct(state) {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    // fetchProducts
    builder
      .addCase(fetchProductsThunk.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
        state.currentRequestId = action.meta.requestId;
      })
      .addCase(fetchProductsThunk.fulfilled, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;

        state.isLoading = false;
        state.items = action.payload.data || [];
        state.count = action.payload.count || 0;
        state.page = action.payload.page || 1;
        state.perPage = action.payload.perPage || 10;
        state.totalPages = action.payload.totalPages || 1;
        state.hasNextPage = action.payload.hasNextPage || false;
        state.hasPrevPage = action.payload.hasPrevPage || false;
      })
      .addCase(fetchProductsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      });

    // fetchProductById
    builder
      .addCase(fetchProductByIdThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.currentProduct = null;
      })
      .addCase(fetchProductByIdThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProduct = action.payload.data || null;
      })
      .addCase(fetchProductByIdThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.currentProduct = null;
        state.error = action.payload || action.error.message;
      });

    // createProduct
    builder
      .addCase(createProductThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProductThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const product = action.payload.data;
        if (product) {
          state.items.unshift(product);
          state.count += 1;
        }
      })
      .addCase(createProductThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      });

    // updateProduct
    builder
      .addCase(updateProductThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProductThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const updated = action.payload.data;
        if (!updated) return;

        const idx = state.items.findIndex((p) => p._id === updated._id);
        if (idx !== -1) {
          state.items[idx] = updated;
        }

        if (state.currentProduct && state.currentProduct._id === updated._id) {
          state.currentProduct = updated;
        }
      })
      .addCase(updateProductThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      });

    // deleteProduct
    builder
      .addCase(deleteProductThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProductThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const { id } = action.payload;
        state.items = state.items.filter((p) => p._id !== id);
        state.count = Math.max(0, state.count - 1);
        if (state.currentProduct && state.currentProduct._id === id) {
          state.currentProduct = null;
        }
      })
      .addCase(deleteProductThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      });
    builder
      .addCase(fetchMaxProductPriceThunk.pending, (state) => {
        state.maxPriceLoading = true;
        state.maxPriceError = null;
      })
      .addCase(fetchMaxProductPriceThunk.fulfilled, (state, action) => {
        state.maxPriceLoading = false;
        state.maxPrice = action.payload;
      })
      .addCase(fetchMaxProductPriceThunk.rejected, (state, action) => {
        state.maxPriceLoading = false;
        state.maxPriceError = action.payload || "Failed to load max price";
      });
  },
});

export const { clearCurrentProduct } = productsReducer.actions;
export default productsReducer.reducer;

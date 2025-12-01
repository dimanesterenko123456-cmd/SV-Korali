// src/redux/slices/productsSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchProducts,
  fetchProductById,
  createProduct,
  updateProduct,
  deleteProduct,
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
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.data || [];
        state.count = action.payload.count || 0;
        state.page = action.payload.page || 1;
        state.perPage = action.payload.perPage || 10;
        state.totalPages = action.payload.totalPages || 1;
        state.hasNextPage = action.payload.hasNextPage || false;
        state.hasPrevPage = action.payload.hasPrevPage || false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      });

    // fetchProductById
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.currentProduct = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProduct = action.payload.data || null;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.currentProduct = null;
        state.error = action.payload || action.error.message;
      });

    // createProduct
    builder
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        const product = action.payload.data;
        if (product) {
          state.items.unshift(product);
          state.count += 1;
        }
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      });

    // updateProduct
    builder
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
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
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      });

    // deleteProduct
    builder
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        const { id } = action.payload;
        state.items = state.items.filter((p) => p._id !== id);
        state.count = Math.max(0, state.count - 1);
        if (state.currentProduct && state.currentProduct._id === id) {
          state.currentProduct = null;
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearCurrentProduct } = productsReducer.actions;
export default productsReducer.reducer;

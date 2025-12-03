// src/redux/operations/productsOperations.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../axiosConfig/api";

const handleError = (error, thunkAPI) => {
  const message =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error.message ||
    "Something went wrong";
  return thunkAPI.rejectWithValue(message);
};

// params: { page, perPage, sortBy, sortOrder, category, minPrice, maxPrice, inStock, search }
export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (params = {}, thunkAPI) => {
    try {
      const { data } = await API.get("/products", { params });
      // data: { status, message, data, count, page, perPage, totalPages, hasNextPage, hasPrevPage }
      return data;
    } catch (error) {
      return handleError(error, thunkAPI);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchById",
  async (id, thunkAPI) => {
    try {
      const { data } = await API.get(`/products/${id}`);
      // data: { status, message, data: product }
      return data;
    } catch (error) {
      return handleError(error, thunkAPI);
    }
  }
);

// Admin: create
export const createProduct = createAsyncThunk(
  "products/create",
  async (payload, thunkAPI) => {
    try {
      const { data } = await API.post("/products", payload);
      // data: { status, message, data: product }
      return data;
    } catch (error) {
      return handleError(error, thunkAPI);
    }
  }
);

// Admin: update
export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, payload }, thunkAPI) => {
    try {
      const { data } = await API.patch(`/products/${id}`, payload);
      // data: { status, message, data: product }
      return data;
    } catch (error) {
      return handleError(error, thunkAPI);
    }
  }
);

// Admin: delete
export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id, thunkAPI) => {
    try {
      await API.delete(`/products/${id}`);
      return { id };
    } catch (error) {
      return handleError(error, thunkAPI);
    }
  }
);

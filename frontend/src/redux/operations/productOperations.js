// src/redux/operations/productsOperations.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { API, setAuthHeader } from "../../axiosConfig/api";

const handleError = (error, thunkAPI) => {
  const message =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error.message ||
    "Something went wrong";
  return thunkAPI.rejectWithValue(message);
};

// GET /products
export const fetchProductsThunk = createAsyncThunk(
  "products/fetchAll",
  async (params = {}, thunkAPI) => {
    try {
      const { data } = await API.get("/products", { params });
      return data;
    } catch (error) {
      return handleError(error, thunkAPI);
    }
  }
);

// GET /products/:id
export const fetchProductByIdThunk = createAsyncThunk(
  "products/fetchById",
  async (id, thunkAPI) => {
    try {
      const { data } = await API.get(`/products/${id}`);
      return data;
    } catch (error) {
      return handleError(error, thunkAPI);
    }
  }
);

// POST /products (admin)
export const createProductThunk = createAsyncThunk(
  "products/create",
  async (payload, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.accessToken;

      if (token) {
        setAuthHeader(token);
      }

      let body = payload;
      if (!(payload instanceof FormData)) {
        body = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            body.append(key, value);
          }
        });
      }

      const { data } = await API.post("/products", body, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return data;
    } catch (error) {
      console.log(
        "Create product error response:",
        error?.response?.data || error.message
      );
      return handleError(error, thunkAPI);
    }
  }
);

// PATCH /products/:id (admin)
export const updateProductThunk = createAsyncThunk(
  "products/update",
  async ({ id, payload }, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.accessToken;
      if (token) {
        setAuthHeader(token);
      }

      let body = payload;
      if (!(payload instanceof FormData)) {
        body = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            body.append(key, value);
          }
        });
      }

      const { data } = await API.patch(`/products/${id}`, body, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return data;
    } catch (error) {
      return handleError(error, thunkAPI);
    }
  }
);

// DELETE /products/:id (admin)
export const deleteProductThunk = createAsyncThunk(
  "products/delete",
  async (id, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.accessToken;
      if (token) {
        setAuthHeader(token);
      }

      await API.delete(`/products/${id}`);
      return { id };
    } catch (error) {
      return handleError(error, thunkAPI);
    }
  }
);

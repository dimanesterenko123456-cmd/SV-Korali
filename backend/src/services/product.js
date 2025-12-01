// src/services/product.js

import { ProductCollection } from '../db/models/product.js';

export const getAllProducts = async () => {
  const products = await ProductCollection.find();
  return products;
};

export const getProductById = async (productId) => {
  const product = await ProductCollection.findById(productId);
  return product;
};

export const createProduct = async (payload) => {
  const product = await ProductCollection.create(payload);
  return product;
};

export const updateProductById = async (productId, payload) => {
  const product = await ProductCollection.findByIdAndUpdate(
    productId,
    payload,
    {
      new: true,
      runValidators: true,
    },
  );

  return product;
};

export const deleteProductById = async (productId) => {
  const product = await ProductCollection.findByIdAndDelete(productId);
  return product;
};

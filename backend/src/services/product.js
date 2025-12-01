// src/services/product.js

import { ProductCollection } from '../db/models/product.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllProducts = async ({
  page = 1,
  perPage = 10,
  sortBy = 'createdAt',
  sortOrder = 'asc',
  filter = {},
} = {}) => {
  const skip = (page - 1) * perPage;

  const sortDirection = sortOrder === 'desc' ? -1 : 1;
  const sort = { [sortBy]: sortDirection };

  const [products, count] = await Promise.all([
    ProductCollection.find(filter).sort(sort).skip(skip).limit(perPage),
    ProductCollection.countDocuments(filter),
  ]);

  const pagination = calculatePaginationData(count, perPage, page);

  return {
    data: products,
    ...pagination,
  };
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

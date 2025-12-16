// src/controllers/cart.js
import createHttpError from 'http-errors';
import mongoose from 'mongoose';

import {
  addItemToCart,
  assertProductExists,
  clearCart,
  findCartByUserId,
  removeItemFromCart,
  updateCartItemQuantity,
} from '../services/cart.js';

const ensureValidProduct = async (productId) => {
  const isValid = await assertProductExists(productId);

  if (!isValid) {
    throw createHttpError(404, 'Product not found');
  }
};

export const getMyCartController = async (req, res) => {
  const cart = await findCartByUserId(req.user._id);

  res.json({
    status: 200,
    message: 'Successfully fetched cart',
    data: cart ?? { items: [] },
  });
};

export const addCartItemController = async (req, res) => {
  const { productId, quantity } = req.body;

  await ensureValidProduct(productId);

  const cart = await addItemToCart(req.user._id, productId, quantity);

  res.status(201).json({
    status: 201,
    message: 'Item added to cart',
    data: cart,
  });
};

export const updateCartItemController = async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw createHttpError(400, 'Invalid product id');
  }

  await ensureValidProduct(productId);

  const cart = await updateCartItemQuantity(req.user._id, productId, quantity);

  res.json({
    status: 200,
    message: 'Cart item updated',
    data: cart,
  });
};

export const removeCartItemController = async (req, res) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw createHttpError(400, 'Invalid product id');
  }

  const cart = await removeItemFromCart(req.user._id, productId);

  res.json({
    status: 200,
    message: 'Item removed from cart',
    data: cart,
  });
};

export const clearCartController = async (req, res) => {
  const cart = await clearCart(req.user._id);

  res.json({
    status: 200,
    message: 'Cart cleared',
    data: cart,
  });
};

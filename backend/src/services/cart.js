// src/services/cart.js
import mongoose from 'mongoose';
import { CartCollection } from '../db/models/cart.js';
import { ProductCollection } from '../db/models/product.js';

const ensureCart = async (userId) => {
  const existing = await CartCollection.findOne({ userId });

  if (existing) {
    return existing;
  }

  return CartCollection.create({ userId, items: [] });
};

export const findCartByUserId = async (userId) =>
  CartCollection.findOne({ userId }).populate('items.productId');

export const addItemToCart = async (userId, productId, quantity = 1) => {
  const cart = await ensureCart(userId);
  const normalizedQty = Math.max(1, Number(quantity) || 1);

  const existing = cart.items.find((item) => item.productId.equals(productId));

  if (existing) {
    existing.quantity += normalizedQty;
  } else {
    cart.items.push({ productId, quantity: normalizedQty });
  }

  await cart.save();

  return cart.populate('items.productId');
};

export const updateCartItemQuantity = async (userId, productId, quantity) => {
  const cart = await ensureCart(userId);
  const normalizedQty = Math.max(1, Number(quantity) || 1);

  const existing = cart.items.find((item) => item.productId.equals(productId));

  if (!existing) {
    cart.items.push({ productId, quantity: normalizedQty });
  } else {
    existing.quantity = normalizedQty;
  }

  await cart.save();

  return cart.populate('items.productId');
};

export const removeItemFromCart = async (userId, productId) => {
  const cart = await ensureCart(userId);
  cart.items = cart.items.filter((item) => !item.productId.equals(productId));

  await cart.save();

  return cart.populate('items.productId');
};

export const clearCart = async (userId) => {
  const cart = await ensureCart(userId);
  cart.items = [];

  await cart.save();

  return cart.populate('items.productId');
};

export const assertProductExists = async (productId) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return false;
  }

  const product = await ProductCollection.findById(productId);
  return Boolean(product);
};

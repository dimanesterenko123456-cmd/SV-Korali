// src/validation/cart.js
import Joi from 'joi';

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

export const addCartItemSchema = Joi.object({
  productId: objectId.required(),
  quantity: Joi.number().integer().min(1).default(1),
});

export const updateCartItemSchema = Joi.object({
  quantity: Joi.number().integer().min(1).required(),
});

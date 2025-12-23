// src/validation/product.js
import Joi from 'joi';

export const createProductSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().allow('', null),
  price: Joi.number().positive().required(),
  category: Joi.string().allow('', null),
  length: Joi.string().max(100).allow('', null),
  beadSize: Joi.string().max(100).allow('', null),
  inStock: Joi.boolean().default(true),
  countInStock: Joi.number().integer().min(0).default(0),

  images: Joi.alternatives()
    .try(Joi.array().items(Joi.string().uri()), Joi.string().uri())
    .optional(),
});

export const updateProductSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  description: Joi.string().allow('', null),
  price: Joi.number().positive(),
  category: Joi.string().allow('', null),
  length: Joi.string().max(100).allow('', null),
  beadSize: Joi.string().max(100).allow('', null),
  inStock: Joi.boolean(),
  countInStock: Joi.number().integer().min(0),
  images: Joi.alternatives()
    .try(Joi.array().items(Joi.string().uri()), Joi.string().uri())
    .optional(),
});

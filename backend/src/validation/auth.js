// src/validation/auth.js
import Joi from 'joi';
// import { USER_ROLES } from '../constans/index.js';

export const registerUserSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
  // role: Joi.string()
  //   .valid(...Object.values(USER_ROLES))
  //   .default(USER_ROLES.CLIENT),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
});

export const requestResetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(6).max(128).required(),
});

export const loginWithGoogleSchema = Joi.object({
  code: Joi.string().required(),
});

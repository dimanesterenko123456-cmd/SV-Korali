// src/middlewares/authorizeRole.js
import createHttpError from 'http-errors';
import { USER_ROLES } from '../constans/index.js';

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== USER_ROLES.ADMIN) {
    return next(createHttpError(403, 'Forbidden'));
  }

  next();
};

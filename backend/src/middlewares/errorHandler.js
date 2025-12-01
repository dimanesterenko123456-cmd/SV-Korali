// src/middlewares/errorHandler.js

import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({
      status: err.status,
      message: err.name,
      data: err,
    });
    return;
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      status: 400,
      message: `Invalid value for field "${err.path}"`,
    });
  }

  res.status(500).json({
    message: 'Something went wrong',
    error: err.message,
  });
};

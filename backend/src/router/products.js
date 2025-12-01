// src/router/products.js
import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import {
  getAllProductsController,
  getProductByIdController,
  createProductController,
  patchProductController,
  deleteProductController,
} from '../controllers/product.js';

import { isValidId } from '../middlewares/isValidId.js';
// import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.get('/', ctrlWrapper(getAllProductsController));

router.get(
  '/:productId',
  isValidId('productId'),
  ctrlWrapper(getProductByIdController),
);

router.post('/', ctrlWrapper(createProductController));

router.patch(
  '/:productId',
  isValidId('productId'),
  ctrlWrapper(patchProductController),
);

router.delete(
  '/:productId',
  // authenticate,
  isValidId('productId'),
  ctrlWrapper(deleteProductController),
);

export default router;

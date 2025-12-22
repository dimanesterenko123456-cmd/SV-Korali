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
import { authenticate } from '../middlewares/authenticate.js';
import { requireAdmin } from '../middlewares/authorizeRole.js';
import {
  createProductSchema,
  updateProductSchema,
} from '../validation/product.js';
import { validateBody } from '../middlewares/validateBody.js';
import { upload } from '../middlewares/multer.js';

const router = Router();

const uploadProductImages = upload.fields([
  { name: 'image', maxCount: 8 },
  { name: 'images', maxCount: 8 },
]);

router.get('/', ctrlWrapper(getAllProductsController));

router.get(
  '/:productId',
  isValidId('productId'),
  ctrlWrapper(getProductByIdController),
);

router.post(
  '/',
  authenticate,
  requireAdmin,
  uploadProductImages,
  validateBody(createProductSchema),
  ctrlWrapper(createProductController),
);

router.patch(
  '/:productId',
  authenticate,
  requireAdmin,
  uploadProductImages,
  isValidId('productId'),
  validateBody(updateProductSchema),
  ctrlWrapper(patchProductController),
);

router.delete(
  '/:productId',
  authenticate,
  requireAdmin,
  isValidId('productId'),
  ctrlWrapper(deleteProductController),
);

export default router;

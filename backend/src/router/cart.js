// src/router/cart.js
import { Router } from 'express';

import {
  addCartItemController,
  clearCartController,
  getMyCartController,
  removeCartItemController,
  updateCartItemController,
} from '../controllers/cart.js';
import { authenticate } from '../middlewares/authenticate.js';
import { validateBody } from '../middlewares/validateBody.js';
import { addCartItemSchema, updateCartItemSchema } from '../validation/cart.js';

const cartRouter = Router();

cartRouter.use(authenticate);

cartRouter.get('/', getMyCartController);
cartRouter.post(
  '/items',
  validateBody(addCartItemSchema),
  addCartItemController,
);
cartRouter.patch(
  '/items/:productId',
  validateBody(updateCartItemSchema),
  updateCartItemController,
);
cartRouter.delete('/items/:productId', removeCartItemController);
cartRouter.delete('/', clearCartController);

export default cartRouter;

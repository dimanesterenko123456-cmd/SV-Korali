//src/router/index.js

import { Router } from 'express';
import authRouter from './auth.js';
import productsRouter from './products.js';
import cartRouter from './cart.js';

const router = Router();

router.use('/products', productsRouter);
router.use('/auth', authRouter);
router.use('/cart', cartRouter);

export default router;

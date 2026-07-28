//src/router/index.js

import { Router } from 'express';
import authRouter from './auth.js';
import productsRouter from './products.js';
import cartRouter from './cart.js';
import paymentsRouter from './payments.js';
import couponsRouter from './coupons.js';

const router = Router();

router.use('/products', productsRouter);
router.use('/auth', authRouter);
router.use('/cart', cartRouter);
router.use('/payments', paymentsRouter);
router.use('/coupons', couponsRouter);

export default router;

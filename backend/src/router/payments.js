// src/router/payments.js
import { Router } from 'express';

import {
  createCheckoutSessionController,
  getCheckoutSessionController,
} from '../controllers/payments.js';
import { authenticate } from '../middlewares/authenticate.js';

const paymentsRouter = Router();

paymentsRouter.use(authenticate);

paymentsRouter.post('/checkout', createCheckoutSessionController);
paymentsRouter.get('/checkout/session', getCheckoutSessionController);

export default paymentsRouter;

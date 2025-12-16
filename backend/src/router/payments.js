// src/router/payments.js
import { Router } from 'express';

import { createCheckoutSessionController } from '../controllers/payments.js';
import { authenticate } from '../middlewares/authenticate.js';

const paymentsRouter = Router();

paymentsRouter.use(authenticate);

paymentsRouter.post('/checkout', createCheckoutSessionController);

export default paymentsRouter;

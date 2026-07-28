import { Router } from 'express';
import {
  getAllCouponsController,
  updateCouponStatusController,
} from '../controllers/coupon.js';
import { authenticate } from '../middlewares/authenticate.js';
import { requireAdmin } from '../middlewares/authorizeRole.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { updateCouponStatusSchema } from '../validation/coupon.js';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/', ctrlWrapper(getAllCouponsController));

router.patch(
  '/:couponId/status',
  isValidId('couponId'),
  validateBody(updateCouponStatusSchema),
  ctrlWrapper(updateCouponStatusController),
);

export default router;

import { randomBytes } from 'node:crypto';
import createHttpError from 'http-errors';
import { CouponsCollection } from '../db/models/coupon.js';

const generateCouponCode = () => {
  const value = randomBytes(4).toString('hex').toUpperCase();
  return `SV10-${value.slice(0, 4)}-${value.slice(4)}`;
};

export const createWelcomeCoupon = async (user) => {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      return await CouponsCollection.create({
        userId: user._id,
        customerName: user.name,
        customerEmail: user.email,
        code: generateCouponCode(),
      });
    } catch (error) {
      const isCodeCollision =
        error?.code === 11000 && Boolean(error?.keyPattern?.code);

      if (!isCodeCollision || attempt === 4) {
        throw error;
      }
    }
  }

  throw createHttpError(500, 'Could not generate a unique coupon');
};

export const getAllCoupons = async () =>
  CouponsCollection.find()
    .populate('userId', 'name email role createdAt')
    .sort({ createdAt: -1 })
    .lean();

export const updateCouponStatus = async (couponId, status) => {
  const coupon = await CouponsCollection.findByIdAndUpdate(
    couponId,
    {
      status,
      redeemedAt: status === 'redeemed' ? new Date() : null,
    },
    { new: true },
  )
    .populate('userId', 'name email role createdAt')
    .lean();

  if (!coupon) {
    throw createHttpError(404, 'Coupon not found');
  }

  return coupon;
};

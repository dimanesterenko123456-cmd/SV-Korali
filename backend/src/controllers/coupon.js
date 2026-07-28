import {
  getAllCoupons,
  updateCouponStatus,
} from '../services/coupon.js';

export const getAllCouponsController = async (req, res) => {
  const coupons = await getAllCoupons();

  res.json({
    status: 200,
    message: 'Successfully fetched coupons',
    data: coupons,
    count: coupons.length,
  });
};

export const updateCouponStatusController = async (req, res) => {
  const coupon = await updateCouponStatus(
    req.params.couponId,
    req.body.status,
  );

  res.json({
    status: 200,
    message: 'Coupon status updated',
    data: coupon,
  });
};

import Joi from 'joi';

export const updateCouponStatusSchema = Joi.object({
  status: Joi.string().valid('active', 'redeemed').required(),
});

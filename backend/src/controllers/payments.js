// src/controllers/payments.js
import createHttpError from 'http-errors';
import mongoose from 'mongoose';

import { ProductCollection } from '../db/models/product.js';
import { findCartByUserId } from '../services/cart.js';
import { getEnvVar } from '../utils/getEnvVar.js';

const stripeSecretKey = getEnvVar('STRIPE_SECRET_KEY');
const clientBaseUrl = getEnvVar('FRONTEND_URL', 'http://localhost:5173');

const toCents = (price) => Math.max(0, Math.round(Number(price) * 100) || 0);

const buildLineItemsFromPayload = async (items = []) => {
  const validIds = items
    .map((item) => item?.productId)
    .filter((id) => mongoose.Types.ObjectId.isValid(id));

  if (validIds.length === 0) {
    return [];
  }

  const products = await ProductCollection.find({ _id: { $in: validIds } });
  const productMap = new Map(
    products.map((product) => [String(product._id), product]),
  );

  return items
    .map((item) => {
      const product = productMap.get(String(item.productId));
      if (!product) return null;

      const quantity = Math.max(1, Number(item.quantity) || 1);
      const unitAmount = toCents(product.price);

      if (unitAmount <= 0) return null;

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: unitAmount,
        },
        quantity,
      };
    })
    .filter(Boolean);
};

const buildLineItemParams = (lineItems) => {
  const params = new URLSearchParams();

  params.append('mode', 'payment');
  params.append('payment_method_types[0]', 'card');
  params.append(
    'success_url',
    `${clientBaseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
  );
  params.append('cancel_url', `${clientBaseUrl}/cart`);

  lineItems.forEach((item, index) => {
    params.append(`line_items[${index}][price_data][currency]`, 'usd');
    params.append(
      `line_items[${index}][price_data][unit_amount]`,
      String(item.price_data.unit_amount),
    );
    params.append(
      `line_items[${index}][price_data][product_data][name]`,
      item.price_data.product_data.name,
    );

    if (item.price_data.product_data.description) {
      params.append(
        `line_items[${index}][price_data][product_data][description]`,
        item.price_data.product_data.description,
      );
    }

    params.append(`line_items[${index}][quantity]`, String(item.quantity));
  });

  return params;
};

export const createCheckoutSessionController = async (req, res) => {
  const payloadItems = Array.isArray(req.body?.items) ? req.body.items : [];
  const cart = await findCartByUserId(req.user._id);

  if ((!cart || cart.items.length === 0) && payloadItems.length === 0) {
    throw createHttpError(400, 'Cart is empty');
  }

  const cartLineItems = cart
    ? cart.items
        .filter((item) => item?.productId)
        .map((item) => {
          const unitAmount = toCents(item.productId.price);
          const quantity = Number(item.quantity) || 0;

          if (unitAmount <= 0 || quantity <= 0) {
            return null;
          }

          return {
            price_data: {
              currency: 'usd',
              product_data: {
                name: item.productId.name,
                description: item.productId.description,
              },
              unit_amount: unitAmount,
            },
            quantity,
          };
        })
        .filter(Boolean)
    : [];

  const bodyLineItems = await buildLineItemsFromPayload(payloadItems);
  const lineItems = bodyLineItems.length > 0 ? bodyLineItems : cartLineItems;

  if (lineItems.length === 0) {
    throw createHttpError(400, 'No purchasable items in cart');
  }

  const params = buildLineItemParams(lineItems);
  params.append('metadata[userId]', String(req.user._id));

  if (cart?._id) {
    params.append('metadata[cartId]', String(cart._id));
  }

  const stripeResponse = await fetch(
    'https://api.stripe.com/v1/checkout/sessions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    },
  );

  if (!stripeResponse.ok) {
    const errorBody = await stripeResponse.text();
    throw createHttpError(stripeResponse.status, errorBody || 'Stripe error');
  }

  const session = await stripeResponse.json();

  res.status(201).json({
    status: 201,
    message: 'Stripe checkout session created',
    data: { id: session.id, url: session.url },
  });
};

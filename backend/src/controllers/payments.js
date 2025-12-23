// src/controllers/payments.js
import createHttpError from 'http-errors';
import mongoose from 'mongoose';

import { CartCollection } from '../db/models/cart.js';
import { ProductCollection } from '../db/models/product.js';
import { findCartByUserId } from '../services/cart.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { stripe } from '../utils/stripeClient.js';

const clientBaseUrl = getEnvVar('FRONTEND_URL', 'http://localhost:5173');
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

const toCents = (price) => Math.max(0, Math.round(Number(price) * 100) || 0);
const normalizeQty = (value) => Math.max(1, Number(value) || 1);
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const buildQtyMap = (items = []) => {
  const map = new Map();

  items.forEach((item) => {
    const productId = item?.productId?._id ?? item?.productId;
    const qty = normalizeQty(item?.quantity);

    if (!isValidObjectId(productId)) return;

    const key = String(productId);
    map.set(key, (map.get(key) || 0) + qty);
  });

  return map;
};

const parseMetadataItems = (raw) => {
  if (!raw || typeof raw !== 'string') return [];

  try {
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item) => ({
        productId: item?.productId,
        quantity: normalizeQty(item?.quantity),
      }))
      .filter((item) => isValidObjectId(item.productId));
  } catch (error) {
    if (error) return [];
  }
};

const mapProductToLineItem = (product, quantity) => {
  const unitAmount = toCents(product.price);

  if (unitAmount <= 0 || quantity <= 0) return null;

  return {
    price_data: {
      currency: 'usd',
      unit_amount: unitAmount,
      product_data: {
        name: product.name,
        description: product.description,
        images: Array.isArray(product.images)
          ? product.images.filter(Boolean).slice(0, 8)
          : [],
      },
    },
    quantity,
  };
};

const buildLineItemsFromPayload = async (items = []) => {
  const validIds = items
    .map((item) => item?.productId)
    .filter((id) => isValidObjectId(id));

  if (validIds.length === 0) return [];

  const products = await ProductCollection.find({ _id: { $in: validIds } });
  const productMap = new Map(
    products.map((product) => [String(product._id), product]),
  );

  return items
    .map((item) => {
      const product = productMap.get(String(item.productId));
      if (!product) return null;

      return mapProductToLineItem(product, normalizeQty(item.quantity));
    })
    .filter(Boolean);
};

const buildLineItemsFromCart = (cart) =>
  cart.items
    .filter((item) => item?.productId)
    .map((item) =>
      mapProductToLineItem(item.productId, normalizeQty(item.quantity)),
    )
    .filter(Boolean);

export const createCheckoutSessionController = async (req, res) => {
  const payloadItems = Array.isArray(req.body?.items) ? req.body.items : [];
  const cart = await findCartByUserId(req.user._id);

  const normalizedPayloadItems = payloadItems
    .map((item) => ({
      productId: item?.productId,
      quantity: normalizeQty(item?.quantity),
    }))
    .filter((item) => isValidObjectId(item.productId));

  const normalizedCartItems = (cart?.items || [])
    .map((item) => ({
      productId: item?.productId?._id ?? item?.productId,
      quantity: normalizeQty(item?.quantity),
    }))
    .filter((item) => isValidObjectId(item.productId));

  if ((!cart || cart.items.length === 0) && payloadItems.length === 0) {
    throw createHttpError(400, 'Cart is empty');
  }

  const fallbackLineItems = cart ? buildLineItemsFromCart(cart) : [];
  const bodyLineItems = await buildLineItemsFromPayload(normalizedPayloadItems);
  const lineItems =
    bodyLineItems.length > 0 ? bodyLineItems : fallbackLineItems;

  const metadata = {
    userId: String(req.user._id),
    ...(cart?._id ? { cartId: String(cart._id) } : {}),
    ...(metadataItems.length
      ? { cartItems: JSON.stringify(metadataItems) }
      : {}),
  };

  const metadataItems =
    bodyLineItems.length > 0 ? normalizedPayloadItems : normalizedCartItems;

  if (lineItems.length === 0) {
    throw createHttpError(400, 'No purchasable items in cart');
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: lineItems,
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
    shipping_address_collection: {
      allowed_countries: ['US', 'CA', 'GB', 'UA', 'PL', 'DE'],
    },
    customer_email: req.user?.email,
    success_url: `${clientBaseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${clientBaseUrl}/cart`,
    metadata,
  });

  res.status(201).json({
    status: 201,
    message: 'Stripe checkout session created',
    data: { id: session.id, url: session.url },
  });
};

export const getCheckoutSessionController = async (req, res) => {
  const sessionId = req.query?.session_id;

  if (!sessionId) {
    throw createHttpError(400, 'Missing checkout session id');
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (
    session?.metadata?.userId &&
    session.metadata.userId !== String(req.user._id)
  ) {
    throw createHttpError(
      403,
      'You are not allowed to view this checkout session',
    );
  }

  const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, {
    limit: 50,
  });

  res.json({
    status: 200,
    message: 'Stripe checkout session details',
    data: {
      id: session.id,
      paymentStatus: session.payment_status,
      amountTotal: session.amount_total,
      currency: session.currency,
      customerEmail: session.customer_email || session.customer_details?.email,
      items: lineItems.data.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        amountSubtotal: item.amount_subtotal,
        amountTotal: item.amount_total,
        currency: item.currency,
      })),
    },
  });
};

export const handleStripeWebhookController = async (req, res) => {
  if (!stripeWebhookSecret) {
    res.status(204).end();
    return;
  }

  const signature = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      stripeWebhookSecret,
    );
  } catch (err) {
    throw createHttpError(
      400,
      `Stripe signature verification failed: ${err.message}`,
    );
  }
  const updateInventory = async (items) => {
    const qtyMap = buildQtyMap(items);

    if (qtyMap.size === 0) return;

    const products = await ProductCollection.find({
      _id: { $in: Array.from(qtyMap.keys()) },
    });

    await Promise.all(
      products.map((product) => {
        const qty = qtyMap.get(String(product._id));
        const nextCount = Math.max(0, (product.countInStock || 0) - qty);

        product.countInStock = nextCount;
        product.inStock = nextCount > 0;

        return product.save();
      }),
    );
  };

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const cartId = session?.metadata?.cartId;
    const userId = session?.metadata?.userId;
    const metadataItems = parseMetadataItems(session?.metadata?.cartItems);

    let processedCart = false;

    if (cartId && userId && mongoose.Types.ObjectId.isValid(cartId)) {
      const cart = await CartCollection.findOne({
        _id: cartId,
        userId: new mongoose.Types.ObjectId(userId),
      }).populate('items.productId');

      if (cart) {
        await updateInventory(cart.items);

        await CartCollection.findOneAndUpdate(
          { _id: cartId, userId: new mongoose.Types.ObjectId(userId) },
          { $set: { items: [] } },
        );

        processedCart = true;
      }
    }

    if (!processedCart && metadataItems.length) {
      await updateInventory(metadataItems);
    }
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      await CartCollection.findOneAndUpdate(
        { userId: new mongoose.Types.ObjectId(userId) },
        { $set: { items: [] } },
      );
    }
  }

  res.json({ received: true });
};

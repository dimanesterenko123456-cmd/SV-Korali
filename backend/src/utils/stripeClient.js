// src/utils/stripeClient.js
import Stripe from 'stripe';

import { getEnvVar } from './getEnvVar.js';

const stripeSecretKey = getEnvVar('STRIPE_SECRET_KEY');
const stripeApiVersion = getEnvVar('STRIPE_API_VERSION', '2023-10-16');

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: stripeApiVersion,
});

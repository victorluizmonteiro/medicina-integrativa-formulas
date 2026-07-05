import Stripe from "stripe";

const secret = process.env.STRIPE_SECRET_KEY;

if (!secret) {
  throw new Error("STRIPE_SECRET_KEY ausente nas variáveis de ambiente.");
}

// Uso exclusivo em servidor. A secret key nunca deve ir para o cliente.
export const stripe = new Stripe(secret);

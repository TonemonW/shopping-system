"use server"

import { createSafeActionClient } from 'next-safe-action'
import { paymentIntentSchema } from '@/types/payment-intent-schema';
import { auth } from '../auth'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET!)
const actionClient = createSafeActionClient();

export const createPaymentIntent = actionClient
    .schema(paymentIntentSchema)
    .action(async ({ parsedInput: { amount, cart, currency } }) => {
        const user = await auth()
        if (!user) return { error: "please login to continue" }
        if (!amount) return { error: "No Product to checkout" }
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                cart: JSON.stringify(cart),
            },
        })
        return {
            success: {
                paymentIntentID: paymentIntent.id,
                clientSecretID: paymentIntent.client_secret,
                user: user.user.email,
            },
        }
    })

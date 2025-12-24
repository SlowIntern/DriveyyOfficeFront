import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
   // apiVersion : "2023-10-16",
});

export async function POST(req: Request) {
    const { amount } = await req.json();

    const paymentIntent = await stripe.paymentIntents.create({
        amount, // amount in smallest unit (₹100 = 10000 paisa)
        currency: "inr",
        automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
    });
}

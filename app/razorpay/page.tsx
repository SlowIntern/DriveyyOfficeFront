"use client";

import { useState } from "react";
import { openRazorpayCheckout } from "../lib/razorpay";
import api from "../lib/api";


export default function RidePaymentButton({ rideId  }: { rideId: string }) {
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        setLoading(true);

        try {
            // Call Next.js API using Axios
            const res = await api.post("/rides/payment", { rideId });

            // Axios returns data inside res.data
            const data = res.data;
            console.log("Backend Data:", data);

            openRazorpayCheckout({
                orderId: data.orderId,
                amount: data.amount,
                currency: data.currency,
            });

        } catch (error) {
            console.error("Payment Error:", error);
        }

        setLoading(false);
    };

    return (
        <button onClick={handlePayment} disabled={loading}>
            {loading ? "Processing..." : "Pay for Ride"}
        </button>
    );
}

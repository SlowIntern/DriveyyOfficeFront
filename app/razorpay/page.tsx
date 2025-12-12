"use client";

import { useEffect, useState } from "react";
import { openRazorpayCheckout } from "../lib/razorpay";
import api from "../lib/api";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";


export default function RidePaymentButton({ rideId  }: { rideId: string }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        console.log("Ride ID for payment:", rideId);

    })


    
        const endRideAutomatically = async () => {
            try {
                const res = await api.get("/rides/endridebyme");
                localStorage.removeItem("rideId");
                toast.success("Ride ended successfully!");
            } catch (error) {
                console.error(error);
                toast.error("Error ending ride");
            } finally {
               console.log("Automatic ride end attempt finished.");
            }
        };




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

        await endRideAutomatically();
        router.push("/captainHome");
    };

    return (
        <button onClick={handlePayment} disabled={loading}>
            {loading ? "Processing..." : "Pay for Ride"}
        </button>
    );
}

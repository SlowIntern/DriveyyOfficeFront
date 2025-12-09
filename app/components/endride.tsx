"use client";

import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import api from "../lib/api";
import ORSMap from "./ORSMap";
import RidePaymentButton from "../razorpay/page";


type Ride = {
    rideId: string;
    captainsocketId: string;
    usersocketId: string;
    pickup: string;
    destination: string;
};

export default function EndRide() {
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [ride, setRide] = useState<Ride | null>(null);

    async function fetchRideDetail() {
        try {
            const res = await api.get("rides/currentride");
            setRide(res.data);
        } catch (error) {
            console.log(error);
            toast.error("Error loading current ride");
        }
    }

    useEffect(() => {
        fetchRideDetail();
    }, []);

    const endRide = async () => {
        try {
            setLoading(true);
            await api.get("/rides/endridebyme"); // End ride API
            setShowSuccess(true);
            toast.success("Ride ended successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Error ending ride");
        } finally {
            setLoading(false);
        }
    };

    // Called when payment is successful
    const handlePaymentSuccess = async () => {
        await endRide(); // End the ride automatically after payment
        toast.success("Ride ended successfully moving to payment page");
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center justify-center relative overflow-hidden">

            {/* ORSMap */}
            {ride && (
                <div className="w-full max-w-3xl mb-6 rounded-xl overflow-hidden border border-gray-700">
                    <ORSMap pickup={ride.pickup} destination={ride.destination} />
                </div>
            )}

            <h1 className="text-4xl font-bold mb-6 bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                End Your Ride
            </h1>

            <p className="text-gray-400 text-center mb-6 max-w-md">
                Complete your payment to safely end your ride.
            </p>

            {/* Payment Button */}
            {ride && (
                <button onClick={handlePaymentSuccess}>
                    <RidePaymentButton
                        rideId={ride.rideId}

                    />
                </button>
              
            )}

            {/* Loading Spinner */}
            {loading && (
                <div className="w-16 h-16 border-4 border-t-red-400 border-gray-700 rounded-full animate-spin mt-6"></div>
            )}

            {/* Success Popup */}
            {showSuccess && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded-xl text-center shadow-lg w-80 animate-fadeIn">
                        <h2 className="text-2xl font-bold text-green-400">Ride Ended!</h2>
                        <p className="mt-2 text-gray-300">Your ride has ended successfully.</p>
                        <button
                            onClick={() => setShowSuccess(false)}
                            className="mt-4 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            <ToastContainer position="top-right" autoClose={3000} theme="dark" />
        </div>
    );
}

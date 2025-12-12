"use client";

import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import api from "../lib/api";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/navigation";


type rides = {
    id: string,
    source: string,
    destination: string,    
}
export default function StartRidePage() {
    const [rideId, setRideId] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const[ride,setRide]= useState<rides | null>(null)
    const { user } = useAuth();
    const router = useRouter();


    useEffect(() => {
        if (loading) return; // Don't run until loading is done

        if (!user) {
            toast.error("Failed to fetch captain info");
            return;
        }

        // user exists → fetch ride
        const fetchRide = async () => {
            try {
                const rideId = localStorage.getItem("rideId");
                if (!rideId) return;

                const res = await api.get("rides/currentride", {
                    params: { rideId }, // pass rideId as query param
                });
                setRideId(res.data.rideId);
                console.log("Ride ID:", res.data._id);
            } catch (err) {
                console.log("Ride fetch failed:", err);
            }
        };

        fetchRide(); // <-- MUST CALL IT
    }, [user, loading]);



    const handleStartRide = async () => {
        if (!rideId || !otp) {
            toast.error("Please enter Ride ID and OTP");
            return;
        }

        try {
            setLoading(true);

            const res = await api.post("/rides/start", null, {
                params: { rideId, otp },
            });

            console.log(res.data);
            setShowSuccess(true);
            toast.success("Ride started successfully!");

        
        } catch (error) {
            console.error(error);
            toast.error("Error starting ride");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background gradients */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-10 left-10 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute top-40 right-20 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-500"></div>
                <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
            </div>

            <h1 className="text-4xl font-bold mb-6 bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Start Your Ride
            </h1>

            <p className="text-gray-400 text-center mb-6 max-w-md">
                Enter your Ride ID and OTP to begin your journey.
            </p>

            <input
                type="text"
                placeholder="Ride ID"
                value={rideId}
                onChange={(e) => setRideId(e.target.value)}
                className="border p-3 rounded w-full mb-4 text-black"
            />

            <input
                type="text"
                placeholder="OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="border p-3 rounded w-full mb-6 text-black"
            />

            <button
                onClick={handleStartRide}
                className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-full w-full text-white font-semibold"
                disabled={loading}
            >
                {loading ? "Starting..." : "Start Ride"}
            </button>

            {/* Spinner */}
            {loading && (
                <div className="w-16 h-16 border-4 border-t-blue-400 border-gray-700 rounded-full animate-spin mt-6"></div>
            )}

            {/* Success Popup */}
            {showSuccess && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded-xl text-center shadow-lg w-80 animate-fadeIn">
                        <h2 className="text-2xl font-bold text-green-400">Ride Started!</h2>
                        <p className="mt-2 text-gray-300">Your ride has begun successfully.</p>
                        <button
                            onClick={() => setShowSuccess(false)}
                            className="mt-4 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white"
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

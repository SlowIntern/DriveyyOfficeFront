"use client";

import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import api from "../lib/api";
import ORSMap from "./ORSMap";
import RidePaymentButton from "../razorpay/page";
import { useRouter } from "next/navigation";

type Ride = {
    rideId: string;
    captainsocketId: string;
    usersocketId: string;
    pickup: string;
    destination: string;
    rideType: string; // "normal" | "return"
};

export default function EndRide() {
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [ride, setRide] = useState<Ride | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0); // seconds
    const [stops, setStops] = useState<string[]>([]);
    const [newStop, setNewStop] = useState("");
    const router = useRouter();

    async function fetchRideDetail() {
        try {
            const rideId = localStorage.getItem("rideId");
            if (!rideId) return;

            const res = await api.get("rides/currentride", {
                params: { rideId },
            });
            setRide(res.data);
        } catch (error) {
            console.log(error);
            toast.error("Error loading current ride");
        }
    }

    useEffect(() => {
        fetchRideDetail();
    }, []);

    // Stopwatch logic
    useEffect(() => {
        if (!ride) return;

        const start = Date.now();
        const interval = setInterval(() => {
            const now = Date.now();
            setElapsedTime(Math.floor((now - start) / 1000));
        }, 1000);

        return () => clearInterval(interval);
    }, [ride]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
        const secs = (seconds % 60).toString().padStart(2, "0");
        return `${mins}:${secs}`;
    };

    const addStop = () => {
        if (newStop.trim() === "") return;
        setStops([...stops, newStop.trim()]);
        setNewStop("");
    };

    const removeStop = (index: number) => {
        setStops(stops.filter((_, i) => i !== index));
    };

    const endRide = async () => {
        try {
            setLoading(true);
            // Here you could also send `stops` to the backend if needed
            await api.get("/rides/endridebyme");
            setShowSuccess(true);
            localStorage.removeItem("rideId");
            toast.success("Ride ended successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Error ending ride");
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSuccess = async () => {
        await endRide();
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

            <h1 className="text-4xl font-bold mb-4 bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                End Your Ride
            </h1>

            {/* Stopwatch */}
            {ride && (
                <div className="text-2xl font-mono text-center text-green-400 mb-6">
                    Ride Time: {formatTime(elapsedTime)}
                </div>
            )}

            {/* Manual Stops for return ride */}
            {ride?.rideType === "return" && (
                <div className="w-full max-w-md mb-6 p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                    <h2 className="text-xl font-bold mb-2">Add Manual Stops</h2>
                    <div className="flex gap-2 mb-2">
                        <input
                            type="text"
                            placeholder="Enter stop location"
                            value={newStop}
                            onChange={(e) => setNewStop(e.target.value)}
                            className="flex-1 px-3 py-2 rounded-lg text-black"
                        />
                        <button
                            onClick={addStop}
                            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-all"
                        >
                            Add
                        </button>
                    </div>

                    {/* List of stops */}
                    {stops.length > 0 && (
                        <ul className="space-y-1">
                            {stops.map((stop, index) => (
                                <li
                                    key={index}
                                    className="flex justify-between items-center bg-gray-700/50 px-3 py-1 rounded-lg"
                                >
                                    {stop}
                                    <button
                                        onClick={() => removeStop(index)}
                                        className="text-red-400 font-bold"
                                    >
                                        X
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            <p className="text-gray-400 text-center mb-6 max-w-md">
                Complete your payment to safely end your ride.
            </p>

            {/* Payment Button */}
            {ride && <RidePaymentButton rideId={ride.rideId} />}

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

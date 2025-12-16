"use client";

import { useEffect, useRef, useState } from "react";
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
    rideType: string; // normal | return
};

export default function EndRide() {
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [ride, setRide] = useState<Ride | null>(null);

    // Ride Timer
    const [elapsedTime, setElapsedTime] = useState(0);

    // Waiting Timer
    const [waitingTime, setWaitingTime] = useState(0);
    const [isWaiting, setIsWaiting] = useState(false);
    const waitingIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Stops
    const [stops, setStops] = useState<string[]>([]);
    const [newStop, setNewStop] = useState("");

    const router = useRouter();

    /* ---------------- FETCH RIDE ---------------- */
    async function fetchRideDetail() {
        try {
            const rideId = localStorage.getItem("rideId");
            if (!rideId) return;

            const res = await api.get("rides/currentride", {
                params: { rideId },
            });
            setRide(res.data);
        } catch (error) {
            toast.error("Error loading current ride");
        }
    }

    useEffect(() => {
        fetchRideDetail();
    }, []);

    /* ---------------- RIDE STOPWATCH ---------------- */
    useEffect(() => {
        if (!ride) return;

        const start = Date.now();
        const interval = setInterval(() => {
            setElapsedTime(Math.floor((Date.now() - start) / 1000));
        }, 1000);

        return () => clearInterval(interval);
    }, [ride]);

    /* ---------------- WAITING STOPWATCH ---------------- */
    const startWaiting = () => {
        if (waitingIntervalRef.current) return;
        setIsWaiting(true);

        waitingIntervalRef.current = setInterval(() => {
            setWaitingTime((prev) => prev + 1);
        }, 1000);
    };

    const pauseWaiting = () => {
        if (waitingIntervalRef.current) {
            clearInterval(waitingIntervalRef.current);
            waitingIntervalRef.current = null;
        }
        setIsWaiting(false);
    };

    const resumeWaiting = () => {
        startWaiting();
    };

    const resetWaiting = () => {
        pauseWaiting();
        setWaitingTime(0);
    };

    /* ---------------- HELPERS ---------------- */
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
        const secs = (seconds % 60).toString().padStart(2, "0");
        return `${mins}:${secs}`;
    };

    /* ---------------- STOPS ---------------- */
    const addStop = () => {
        if (!newStop.trim()) return;
        setStops([...stops, newStop.trim()]);
        setNewStop("");
    };

    const removeStop = (index: number) => {
        setStops(stops.filter((_, i) => i !== index));
    };

    /* ---------------- END RIDE ---------------- */
    const endRide = async () => {
        try {
            setLoading(true);

            await api.post("/rides/endridebyme", {
                waitingTimeInSeconds: waitingTime,
                stops,
            });

            localStorage.removeItem("rideId");
            setShowSuccess(true);
            toast.success("Ride ended successfully!");
        } catch (error) {
            toast.error("Error ending ride");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">

            {/* MAP */}
            {ride && (
                <div className="w-full max-w-3xl mb-6 rounded-xl overflow-hidden border border-gray-700">
                    <ORSMap pickup={ride.pickup} destination={ride.destination} />
                </div>
            )}

            <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                End Your Ride
            </h1>

            {/* RIDE TIMER */}
            <div className="text-2xl font-mono text-green-400 mb-4">
                Ride Time: {formatTime(elapsedTime)}
            </div>

            {/* WAITING TIMER */}
            <div className="w-full max-w-md bg-gray-800/60 p-4 rounded-xl border border-gray-700 mb-6">
                <h2 className="text-xl font-bold mb-2 text-yellow-400">
                    Waiting Timer (Stop Area)
                </h2>

                <p className="text-2xl font-mono text-center mb-4">
                    {formatTime(waitingTime)}
                </p>

                <div className="flex justify-center gap-3">
                    {!isWaiting && waitingTime === 0 && (
                        <button onClick={startWaiting} className="px-4 py-2 bg-green-600 rounded-lg">
                            Start
                        </button>
                    )}

                    {isWaiting && (
                        <button onClick={pauseWaiting} className="px-4 py-2 bg-yellow-600 rounded-lg">
                            Pause
                        </button>
                    )}

                    {!isWaiting && waitingTime > 0 && (
                        <button onClick={resumeWaiting} className="px-4 py-2 bg-blue-600 rounded-lg">
                            Resume
                        </button>
                    )}

                    <button onClick={resetWaiting} className="px-4 py-2 bg-red-600 rounded-lg">
                        Reset
                    </button>
                </div>
            </div>

            {/* RETURN RIDE STOPS */}
            {ride?.rideType === "return" && (
                <div className="w-full max-w-md mb-6 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                    <h2 className="text-xl font-bold mb-2">Manual Stops</h2>
                    <div className="flex gap-2 mb-2">
                        <input
                            type="text"
                            value={newStop}
                            onChange={(e) => setNewStop(e.target.value)}
                            placeholder="Enter stop"
                            className="flex-1 px-3 py-2 rounded-lg text-black"
                        />
                        <button onClick={addStop} className="bg-blue-600 px-4 py-2 rounded-lg">
                            Add
                        </button>
                    </div>

                    <ul className="space-y-1">
                        {stops.map((stop, index) => (
                            <li key={index} className="flex justify-between bg-gray-700/50 px-3 py-1 rounded-lg">
                                {stop}
                                <button onClick={() => removeStop(index)} className="text-red-400">
                                    X
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* PAYMENT */}
            {ride && <RidePaymentButton rideId={ride.rideId} />}

            {/* END RIDE */}
            <button
                onClick={endRide}
                disabled={loading}
                className="mt-4 bg-red-500 hover:bg-red-600 px-6 py-2 rounded-lg"
            >
                End Ride
            </button>

            {/* LOADER */}
            {loading && (
                <div className="w-16 h-16 border-4 border-t-red-400 border-gray-700 rounded-full animate-spin mt-6"></div>
            )}

            {/* SUCCESS MODAL */}
            {showSuccess && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded-xl text-center">
                        <h2 className="text-2xl text-green-400 font-bold">Ride Ended!</h2>
                        <button
                            onClick={() => setShowSuccess(false)}
                            className="mt-4 bg-blue-600 px-4 py-2 rounded-lg"
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

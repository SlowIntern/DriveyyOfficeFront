"use client";

import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../lib/api";
import ORSMap from "./ORSMap";
import RidePaymentButton from "../razorpay/page";
import { useRouter } from "next/navigation";

/* ---------------- TYPES ---------------- */
type Ride = {
    rideId: string;
    pickup: string;
    destination: string;
    rideType: "normal" | "return";
    fare: number;
};

export default function EndRide() {
    const router = useRouter();

    const [ride, setRide] = useState<Ride | null>(null);
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    /* Ride timer */
    const [elapsedTime, setElapsedTime] = useState(0);

    /* Waiting timer */
    const [waitingTime, setWaitingTime] = useState(0); // seconds
    const [isWaiting, setIsWaiting] = useState(false);
    const [waitingSent, setWaitingSent] = useState(false);

    const waitingIntervalRef = useRef<NodeJS.Timeout | null>(null);

    /* Stops */
    const [stops, setStops] = useState<string[]>([]);
    const [newStop, setNewStop] = useState("");

    /* ---------------- FETCH RIDE ---------------- */
    useEffect(() => {
        const fetchRide = async () => {
            try {
                const rideId = localStorage.getItem("rideId");
                if (!rideId) return;

                const res = await api.get("/rides/currentride", {
                    params: { rideId },
                });

                setRide(res.data);
            } catch {
                toast.error("Failed to load ride");
            }
        };

        fetchRide();
    }, []);

    /* ---------------- RIDE TIMER ---------------- */
    useEffect(() => {
        if (!ride) return;

        const start = Date.now();
        const interval = setInterval(() => {
            setElapsedTime(Math.floor((Date.now() - start) / 1000));
        }, 1000);

        return () => clearInterval(interval);
    }, [ride]);

    /* ---------------- WAITING TIMER ---------------- */
    const startWaiting = () => {
        if (waitingIntervalRef.current || waitingSent) return;

        setIsWaiting(true);
        waitingIntervalRef.current = setInterval(() => {
            setWaitingTime((prev) => prev + 1);
        }, 1000);
    };

    const pauseWaiting = async () => {
        if (waitingIntervalRef.current) {
            clearInterval(waitingIntervalRef.current);
            waitingIntervalRef.current = null;
        }
        setIsWaiting(false);

        await sendWaitingCharges(); // API CALL HERE
    };

    const resetWaiting = () => {
        if (waitingIntervalRef.current) {
            clearInterval(waitingIntervalRef.current);
            waitingIntervalRef.current = null;
        }
        setIsWaiting(false);
        setWaitingTime(0);
        setWaitingSent(false);
    };

    /* ---------------- SEND WAITING CHARGES ---------------- */
    const sendWaitingCharges = async () => {
        if (waitingSent || waitingTime <= 0) return;

        try {
            const rideId = localStorage.getItem("rideId");
            if (!rideId) return;

            await api.post("/rides/waiting", {
                rideId,
                waitingTime, // seconds
            });

            setWaitingSent(true);
            toast.success("Waiting charges added");
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || "Failed to add waiting charges"
            );
        }
    };

    /* ---------------- HELPERS ---------------- */
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
            .toString()
            .padStart(2, "0");
        const secs = (seconds % 60).toString().padStart(2, "0");
        return `${mins}:${secs}`;
    };

    const waitingMinutes = Math.floor(waitingTime / 60);
    const waitingCharge = Math.floor(waitingMinutes / 10) * 5;

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

            const rideId = localStorage.getItem("rideId");
            if (!rideId) return;

            // Safety: send waiting charges if not already sent
            if (!waitingSent && waitingTime > 0) {
                await sendWaitingCharges();
            }

            await api.post("/rides/endridebyme", {
                rideId,
                stops,
            });

            localStorage.removeItem("rideId");
            toast.success("Ride ended successfully");
            setShowSuccess(true);
        } catch {
            toast.error("Failed to end ride");
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- UI ---------------- */
    return (
        <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
            {ride && (
                <div className="w-full max-w-3xl mb-6 rounded-xl overflow-hidden border border-gray-700">
                    <ORSMap pickup={ride.pickup} destination={ride.destination} />
                </div>
            )}

            <h1 className="text-4xl font-bold mb-4">End Ride</h1>

            <div className="text-2xl font-mono text-green-400 mb-4">
                Ride Time: {formatTime(elapsedTime)}
            </div>

            {/* WAITING */}
            <div className="w-full max-w-md bg-gray-800 p-4 rounded-xl border border-gray-700 mb-6">
                <h2 className="text-xl font-bold mb-2 text-yellow-400">
                    Waiting Timer
                </h2>

                <p className="text-2xl font-mono text-center mb-2">
                    {formatTime(waitingTime)}
                </p>

                <p className="text-center text-sm text-gray-400 mb-4">
                    Waiting Charge: ₹{waitingCharge}
                </p>

                <div className="flex justify-center gap-3">
                    {!isWaiting && !waitingSent && (
                        <button
                            onClick={startWaiting}
                            className="px-4 py-2 bg-green-600 rounded-lg"
                        >
                            Start
                        </button>
                    )}

                    {isWaiting && (
                        <button
                            onClick={pauseWaiting}
                            className="px-4 py-2 bg-yellow-600 rounded-lg"
                        >
                            Pause
                        </button>
                    )}

                    <button
                        onClick={resetWaiting}
                        className="px-4 py-2 bg-red-600 rounded-lg"
                    >
                        Reset
                    </button>
                </div>
            </div>

            {/* STOPS */}
            {ride?.rideType === "return" && (
                <div className="w-full max-w-md mb-6 bg-gray-800 p-4 rounded-xl">
                    <h2 className="text-lg font-bold mb-2">Stops</h2>

                    <div className="flex gap-2 mb-2">
                        <input
                            value={newStop}
                            onChange={(e) => setNewStop(e.target.value)}
                            placeholder="Add stop"
                            className="flex-1 px-3 py-2 text-black rounded-lg"
                        />
                        <button
                            onClick={addStop}
                            className="bg-blue-600 px-4 py-2 rounded-lg"
                        >
                            Add
                        </button>
                    </div>

                    <ul className="space-y-1">
                        {stops.map((stop, index) => (
                            <li
                                key={index}
                                className="flex justify-between bg-gray-700 px-3 py-1 rounded-lg"
                            >
                                {stop}
                                <button
                                    onClick={() => removeStop(index)}
                                    className="text-red-400"
                                >
                                    X
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {ride && <RidePaymentButton rideId={ride.rideId} />}

            <button
                onClick={endRide}
                disabled={loading}
                className="mt-4 bg-red-500 hover:bg-red-600 px-6 py-2 rounded-lg"
            >
                End Ride
            </button>

            {loading && (
                <div className="w-12 h-12 border-4 border-t-red-500 border-gray-600 rounded-full animate-spin mt-4" />
            )}

            {showSuccess && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
                    <div className="bg-gray-800 p-6 rounded-xl text-center">
                        <h2 className="text-2xl text-green-400 font-bold">
                            Ride Completed
                        </h2>
                        <button
                            onClick={() => router.push("/")}
                            className="mt-4 bg-blue-600 px-4 py-2 rounded-lg"
                        >
                            Go Home
                        </button>
                    </div>
                </div>
            )}

            <ToastContainer position="top-right" autoClose={3000} theme="dark" />
        </div>
    );
}

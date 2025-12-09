"use client";

import { useEffect, useState } from "react";
import api from "../lib/api";
import { toast } from "react-toastify";
import socket from "../lib/socket";
import { useRouter } from "next/navigation";

type Captain = {
    _id: string;
    email: string;
    role: "user" | "captain";
};

type Ride = {
    _id: string;
    captainId: string;
    userId: string;
    pickup: string;
    destination: string;
    fare: number;
    status: "pending" | "accepted" | "rejected";
};

export default function CaptainHomepage() {
    const [captain, setCaptain] = useState<Captain | null>(null);
    const [incomingRide, setIncomingRide] = useState<Ride | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    // Fetch captain profile
    useEffect(() => {
        async function fetchCaptain() {
            try {
                const res = await api.get("/auth/profile");
                setCaptain(res.data);
            } catch (error) {
                toast.error("Error fetching captain info");
            }
        }
        fetchCaptain();
    }, []);

    // Register socket
    useEffect(() => {
        if (!captain?._id) return;
        socket.emit("register-socket", { userId: captain._id, role: "captain" });
    }, [captain]);

    // Listen for ride requests
    useEffect(() => {
        const handler = (ride: any) => {
            setIncomingRide(ride);
            localStorage.setItem("rideId", ride._id);
            toast.info("New ride request");
        };
        socket.on("new-ride", handler);

        return () => {
            socket.off("new-ride", handler);
        };
    }, []);

    const acceptRide = async () => {
        if (!incomingRide) return;
        setLoading(true);
        try {
            await api.post("/rides/confirm", { rideId: incomingRide._id });
            toast.success("Ride Accepted!");
            setIncomingRide(null);
            router.push("/chatui");
        
        } catch {
            toast.error("Failed to accept ride");
        } finally {
            setLoading(false);
        }
    };

    const rejectRide = () => {
        toast.info("Ride Rejected");
        setIncomingRide(null);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6 relative overflow-hidden">
            {/* Background gradient or blurred orbs */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-10 left-10 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute top-40 right-20 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-500"></div>
                <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
            </div>

            <h1 className="text-4xl font-bold mb-6 bg-Linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text  text-white">
                Captain Dashboard
            </h1>

            {/* Incoming ride card */}
            {incomingRide && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-96 bg-gray-800/70 backdrop-blur-xl border border-gray-700 shadow-2xl rounded-2xl p-6 space-y-4">
                    <h2 className="text-2xl font-bold text-white mb-2">New Ride Request</h2>
                    <p>
                        <strong>Pickup:</strong> {incomingRide.pickup}
                    </p>
                    <p>
                        <strong>Destination:</strong> {incomingRide.destination}
                    </p>
                    <p>
                        <strong>Fare:</strong> ₹{incomingRide.fare}
                    </p>

                    <div className="flex gap-4 mt-4">
                        <button
                            onClick={acceptRide}
                            disabled={loading}
                            className="flex-1 bg-linear-to-r from-green-500 to-green-700 text-white py-2 rounded-xl font-semibold hover:shadow-lg transition-all"
                        >
                            {loading ? "Accepting..." : "Accept"}
                        </button>

                        <button
                            onClick={rejectRide}
                            className="flex-1 bg-linear-to-r from-red-500 to-red-700 text-white py-2 rounded-xl font-semibold hover:shadow-lg transition-all"
                        >
                            Reject
                        </button>
                    </div>
                </div>
            )}

            {!incomingRide && (
                <div className="mt-10 text-gray-400 text-center">
                    Ajj majdur ka pass koi ghrahak nhi ha
                </div>
            )}
        </div>
    );
}



"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import socket from "../lib/socket";
import api from "../lib/api";

export type User = {
    userId: string;
    email: string;
    role: 'user' | 'captain';
};

export default function UserWaitingRide() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    const [showPopup, setShowPopup] = useState(false);
    const [rideInfo, setRideInfo] = useState<any>(null);

    // 1️⃣ Fetch user info
    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await api.get("/auth/profile");
                setUser(res.data);
            } catch (error) {
                toast.error("Error fetching user info");
            }
        }
        fetchUser();
    }, []);

    // 2️⃣ Socket event for ride confirmation
    useEffect(() => {
        const handler = (data: any) => {
            console.log("Received ride-confirmed event:", data);

            // Save ride info for popup
            setRideInfo(data);
            setShowPopup(true);

            toast.success("Captain accepted your ride!", {
                position: "top-center",
                autoClose: 2000,
            });

            // Auto redirect after 2 sec
            setTimeout(() => {
                router.push(`/chatui`);
            }, 2000);
        };

        socket.on("ride-confirmed", handler);

        return () => {
            socket.off("ride-confirmed", handler);
        };
    }, [router]);

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background gradients */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-10 left-10 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute top-40 right-20 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-500"></div>
                <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
            </div>

            <h1 className="text-4xl font-bold mb-6 bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Waiting for a Captain
            </h1>

            <p className="text-gray-400 text-center mb-6 max-w-md">
                We are finding a nearby captain for your ride. You will be redirected to chat as soon as the ride is accepted.
            </p>

            <div className="w-24 h-24 border-4 border-t-blue-400 border-gray-700 rounded-full animate-spin mb-6"></div>
            <p className="text-gray-500">
                Sitting tight! Good things take a little patience.
            </p>

            {/* Toasts */}
            <ToastContainer position="top-right" autoClose={3000} theme="dark" />

            {/* 3️⃣ Confirmation Popup */}
            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded-xl text-center shadow-lg w-80 animate-fadeIn">
                        <h2 className="text-2xl font-bold text-green-400">Ride Confirmed!</h2>

                        <p className="mt-2 text-gray-300">
                            Captain {rideInfo?.captainName || "Your Captain"} accepted your ride.
                        </p>

                        <p className="text-sm text-gray-400 mt-1">
                            Redirecting...
                        </p>

                        <button
                            onClick={() => router.push(`/user/ride/${rideInfo?.rideId}`)}
                            className="mt-4 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white"
                        >
                            Go Now
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

"use client";

import { useEffect, useState } from "react";
import api from "../lib/api";
import { ToastContainer, toast } from "react-toastify";
import ORSMap from "../components/ORSMap";
import { useRouter } from "next/navigation";

type Ride = {
    rideId: string;
    pickup: string;
    destination: string;
    fare: number;
    captainName: string;
    userName: string;
    distance: number;
    duration: number;
    CaptainName: string;
    UserName: string;
    status: string;
};

export default function RideSummaryPage() {
    const [ride, setRide] = useState<Ride | null>(null);
    const router = useRouter();

    const fetchRide = async () => {
        try {
            const rideId = localStorage.getItem("rideId");
            if (!rideId) return;

            const res = await api.get("rides/currentride", { params: { rideId } });
            setRide(res.data);
            console.log("Summary data:", res.data);
        } catch (err) {
            toast.error("Unable to load ride summary.");
        }
    };

    useEffect(() => {
        fetchRide();
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
            <div className="w-full max-w-3xl">
                <h1 className="text-4xl font-bold text-center mb-6 bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Ride Summary
                </h1>

                {/* Map */}
                {ride && (
                    <div className="w-full h-60 mb-6 rounded-xl overflow-hidden border border-gray-700">
                        <ORSMap pickup={ride.pickup} destination={ride.destination} />
                    </div>
                )}

                {/* Summary Card */}
                {ride ? (
                    <div className="bg-gray-800 p-6 rounded-xl shadow border border-gray-700">
                        <h2 className="text-xl font-bold text-blue-400 mb-4">Ride Details</h2>

                        <div className="space-y-2 text-gray-300">
                            <p><span className="font-semibold text-white">Ride ID:</span> {ride.rideId}</p>
                            <p><span className="font-semibold text-white">Pickup:</span> {ride.pickup}</p>
                            <p><span className="font-semibold text-white">Destination:</span> {ride.destination}</p>
                            <p><span className="font-semibold text-white">Status:</span> {ride.status} km</p>
                     
                        </div>

                        <hr className="my-4 border-gray-700" />

                        <h2 className="text-xl font-bold text-blue-400 mb-4">People</h2>

                        <div className="space-y-2 text-gray-300">
                            <p><span className="font-semibold text-white">Captain:</span> {ride.CaptainName}</p>
                            <p><span className="font-semibold text-white">User:</span> {ride.UserName}</p>
                        </div>

                        <hr className="my-4 border-gray-700" />

                        <h2 className="text-xl font-bold text-blue-400 mb-4">Payment</h2>

                        <p className="text-gray-300">
                            <span className="font-semibold text-white">Total Fare:</span> ₹{ride.fare}
                        </p>

                        <button
                            onClick={() => router.push("/home")}
                            className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg font-semibold"
                        >
                            Back to Home
                        </button>
                    </div>
                ) : (
                    <p className="text-center text-gray-400">Loading summary...</p>
                )}
            </div>

            <ToastContainer position="top-right" autoClose={3000} theme="dark" />
        </div>
    );
}

"use client";

import { MapPin, Car, Star, ArrowRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "../lib/api";
import { toast } from "react-toastify";
import Link from "next/link";
import socket from "../lib/socket";
import { useRouter } from "next/navigation";

type User = {
    _id: string;
    email: string;
    role: "user" | "captain";
};

type RideData = {
    pickup: string;
    destination: string;
};

export default function UberCloneHomepage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { register, handleSubmit, reset, getValues } = useForm<RideData>();
    const [users, setUser] = useState<User | null>(null);
    const router = useRouter();

    const [fareData, setFareData] = useState<
        { type: "moto" | "auto" | "car"; price: number }[] | null
    >(null);

    // Fetch user profile
    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await api.get("/auth/profile");
                setUser(res.data);
            } catch (error) {
                toast.error("Please login to continue");
                router.push("/Login");
            }
        }
        fetchUser();
    }, []);

    // Register Socket
    useEffect(() => {
        if (!users?._id) return;

        socket.emit("register-socket", {
            userId: users._id,
            role: "user",
        });

        console.log("User registered on socket", users._id);
    }, [users]);

    // Get Fare Estimate
    const searchFare = async (data: RideData) => {
        try {
            const res = await api.post("/rides/fare", {
                pickup: data.pickup,
                destination: data.destination,
            });

            setFareData(res.data);
            toast.success("Fare list loaded!");
        } catch (error) {
            toast.error("Failed to fetch fare");
        }
    };

    // Create Ride
    const selectVehicle = async (vehicleType: "moto" | "auto" | "car") => {
        try {
            console.log("Selected vehicle:", vehicleType);
            console.log("pickup", getValues("pickup"));
            console.log("destination", getValues("destination"));
        
            const ride = await api.post("/rides", {
                pickup: getValues("pickup"),
                destination: getValues("destination"),
                vehicleType,
            });

            console.log("Ride created:", ride.data); // ← CHECK THIS
            toast.success("Ride booked successfully!");

            router.push("/waiting");
            console.log("Navigated…"); // ← CHECK THIS
        } catch (error) {
            console.log(error);
            toast.error("Ride booking failed");
        }
    };

    return (
        <>
            {/* Full-Screen Background */}
            <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden relative">
                {/* Navigation */}
                <nav className="relative z-50 backdrop-blur-lg bg-black/40 border-b border-gray-800">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-linear-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                                <Car className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                UberX
                            </span>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-8">
                            <Link href={"/home"} className="text-gray-300 hover:text-white">Home</Link>
                            <Link href={"/captainRegister"} className="text-gray-300 hover:text-white">Drive</Link>
                            <a href="#" className="text-gray-300 hover:text-white">Business</a>
                            <a href="#" className="text-gray-300 hover:text-white">About</a>
                        </div>

                        {/* Mobile Menu */}
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <h1 className="text-5xl md:text-6xl font-extrabold text-white">
                                Go Anywhere <br /> With UberX
                            </h1>

                            <p className="text-xl text-gray-300 max-w-lg">
                                Safe, reliable, and fast rides at your fingertips.
                            </p>
                        </div>

                        {/* Booking Card */}
                        <form id="bookform">
                            <div className="p-8 rounded-3xl bg-gray-900/80 backdrop-blur-xl border border-gray-700 shadow-2xl">
                                <h3 className="text-2xl font-bold mb-6 text-white">
                                    Where to?
                                </h3>

                                {/* Input Fields */}
                                <div className="space-y-4">
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
                                        <input
                                            {...register("pickup", { required: true })}
                                            type="text"
                                            placeholder="Pickup location"
                                            className="w-full pl-12 py-4 rounded-xl bg-gray-800 border border-gray-700"
                                        />
                                   
                                    </div>

                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
                                        <input
                                            {...register("destination", { required: true })}
                                            type="text"
                                            placeholder="Destination"
                                            className="w-full pl-12 py-4 rounded-xl bg-gray-800 border border-gray-700"
                                        />
                                       
                                    </div>

                                    {/* Search Price Button */}
                                    <button
                                        type="button"
                                        onClick={handleSubmit(searchFare)}
                                        className="w-full py-4 bg-blue-600 rounded-xl font-bold text-lg"
                                    >
                                        Search Price
                                    </button>

                                    {/* Fare Results */}
                                    {fareData && (
                                        <div className="mt-6 grid grid-cols-1 gap-4">
                                            {fareData.map((item, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => selectVehicle(item.type)}
                                                    className="p-4 bg-gray-800 border border-gray-700 rounded-xl flex justify-between hover:bg-gray-700"
                                                >
                                                    <span className="text-white capitalize text-lg">
                                                        {item.type}
                                                    </span>
                                                    <span className="text-blue-400 font-bold text-lg">
                                                        ₹{item.price}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        </>
    );
}

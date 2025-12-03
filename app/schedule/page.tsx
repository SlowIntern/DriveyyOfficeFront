"use client";

import { MapPin, Car, Star, ArrowRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "../lib/api";
import { toast } from "react-toastify";
import Link from "next/link";
import socket from "../lib/socket";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";


type user = {
    _id: string;
    email: string;
    role: "user" | "captain";
}

type RideData = {
    pickup: string,
    destination: string,
    vehicleType: 'auto' | 'car' | 'moto';
}

export default function UberCloneHomepage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { register, handleSubmit, reset } = useForm<RideData>();
    const [users, setUser] = useState<user | null>(null);
    const router = useRouter();
   


    
    

    useEffect(() => {

        async function fetchUser() {
            try {
                const res = await api.get("/auth/profile");
                setUser(res.data);
                console.log(res.data);
            } catch (error) {
                console.log(error);
                toast.error("Error while fetching user information")
                router.push("/Login");
            }
        }
        fetchUser();
    }, []);


    //Register the socket for captain
    // useEffect(() => { 
    //         if (!users?._id)
    //             return;
    //          console.log
    //         socket.emit("register-socket", {
    //             userId: users._id,
    //             role: 'user'
    //         });
    //     console.log("Captain registered on socket", users._id);  
    //     console.log(socket.id);

    // }, [users]);

    const onSubmit = async (data: RideData) => {
        try {
            const rides = await api.post("ride-schedule/scheduleRide", data);
            toast.success("Ride created successfully! witing for driver to confirm");
            reset();
            router.push('/waiting');
        }
        catch (error) {
            console.log(error);
            toast.error("Ride creation failed");
        }
    };

    return (
        <>
            {/* Full-Screen Background with Gradient & Subtle Animation */}
            <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden relative">
                {/* Animated Background Orbs */}
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute top-20 left-20 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                    <div className="absolute top-40 right-32 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
                    <div className="absolute bottom-32 left-1/3 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-500"></div>
                </div>

                {/* Navigation Bar */}
                <nav className="relative z-50 backdrop-blur-lg bg-black/40 border-b border-gray-800">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-gradi-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                                <Car className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                UberX
                            </span>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-8">
                            
                            <Link href={'/home'} className="text-gray-300 hover:text-white transition-all">Home</Link>
                            <a href="#" className="text-gray-300 hover:text-white transition-all">Drive</a>
                            <a href="#" className="text-gray-300 hover:text-white transition-all">Business</a>
                            <a href="#" className="text-gray-300 hover:text-white transition-all">About</a>
                            <button className="px-5 py-2 bg-linear-to-r from-blue-600 to-purple-600 rounded-full font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all">
                                Get Started
                            </button>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-lg border-b border-gray-800">
                            <div className="px-6 py-4 space-y-4">
                                <a href="#" className="block text-lg text-gray-300 hover:text-white">Ride</a>
                                <a href="#" className="block text-lg text-gray-300 hover:text-white">Drive</a>
                                <a href="#" className="block text-lg text-gray-300 hover:text-white">Business</a>
                                <a href="#" className="block text-lg text-gray-300 hover:text-white">About</a>
                                <button className="w-full py-3 bg-linear-to-r from-blue-600 to-purple-600 rounded-full font-medium">
                                    Get Started
                                </button>
                            </div>
                        </div>
                    )}
                </nav>

                {/* Hero Section */}
                <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left: Text & CTA */}
                        <div className="space-y-8">
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
                                <span className="bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    Go Anywhere
                                </span>
                                <br />
                                <span className="text-white">With UberX</span>
                            </h1>

                            <p className="text-xl text-gray-300 max-w-lg">
                                Request a ride, hop in, and go. Safe, reliable, and affordable rides at your fingertips.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href={"#bookform"} className="px-8 py-4 bg-linear-to-r from-blue-600 to-purple-600 rounded-full font-semibold text-lg hover:shadow-xl hover:shadow-purple-600/30 transition-all flex items-center justify-center gap-2 group">
                                    Ride Now
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link href={"captainRegister"} className="px-8 py-4 bg-white/10 backdrop-blur-md border border-gray-700 rounded-full font-semibold text-lg hover:bg-white/20 transition-all">
                                    Become a Driver
                                </Link>
                            </div>

                            <div className="flex items-center gap-6 text-sm text-gray-400">
                                <div className="flex items-center gap-2">
                                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                    <span>4.9 Rating</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-green-500" />
                                    <span>Available in 10,000+ cities</span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Ride Request Card (Glassmorphism) */}
                        <form onSubmit={handleSubmit(onSubmit)} id="bookform">
                        <div className="relative">
                            <div className="absolute inset-0 -z-10 bg-linear-to-tr from-blue-500/30 via-purple-500/20 to-pink-500/20 rounded-3xl blur-3xl opacity-70"></div>

                            <div className="p-8 rounded-3xl bg-gray-900/80 backdrop-blur-xl border border-gray-700 shadow-2xl">
                                <h3 className="text-2xl font-bold mb-6 bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                    Where to?
                                </h3>

                                <div className="space-y-4">
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
                                            <input
                                                {...register("pickup", { required: true }) }
                                            type="text"
                                            placeholder="Current location"
                                            className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-800/70 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                            defaultValue="Chandigarh"
                                        />
                                    </div>

                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
                                            <input
                                                {...register("destination",{required:true})}
                                            type="text"
                                            placeholder="Where to?"
                                            className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-800/70 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                        />
            
                                        </div>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-500" />

                                            <select
                                                {...register("vehicleType", { required: true })}
                                                className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-800/70 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all appearance-none"
                                            >
                                                <option defaultValue="" >
                                                    Select vehicle type
                                                </option>
                                                <option value="bike">Bike</option>
                                                <option value="auto">Auto</option>
                                                <option value="car">Car</option>
                                        
                                            </select>

                                            {/* Custom dropdown indicator */}
                                            <svg
                                                className="absolute right-4 top-5 w-4 h-4 text-gray-400 pointer-events-none"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>


                                    <button type="submit" className="w-full py-4 bg-linear-to-r from-blue-600 to-purple-600 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-purple-500/40 transition-all">
                                Book a Ride
                                    </button>
                                </div>

                                <div className="mt-6 grid grid-cols-3 gap-3 text-center text-sm">
                                    <div className="p-3 bg-gray-800/50 rounded-lg">
                                        <div className="text-2xl font-bold text-blue-400">5 min</div>
                                        <div className="text-gray-400">ETA</div>
                                    </div>
                                    <div className="p-3 bg-gray-800/50 rounded-lg">
                                        <div className="text-2xl font-bold text-green-400">$12</div>
                                        <div className="text-gray-400">UberX</div>
                                    </div>
                                    <div className="p-3 bg-gray-800/50 rounded-lg">
                                        <div className="text-2xl font-bold text-purple-400">4.8</div>
                                        <div className="text-gray-400">Rating</div>
                                    </div>
                                </div>
                                </div>
                                
                            </div>
                            </form>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 px-6 bg-black/30">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Why Millions Choose UberX
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: <Car className="w-12 h-12" />,
                                    title: "Ride in Minutes",
                                    desc: "Get picked up in under 5 minutes, anywhere in the city."
                                },
                                {
                                    icon: <Star className="w-12 h-12" />,
                                    title: "Top-Rated Drivers",
                                    desc: "Only the best drivers with 4.8+ ratings."
                                },
                                {
                                    icon: <MapPin className="w-12 h-12" />,
                                    title: "Real-Time Tracking",
                                    desc: "Watch your driver arrive in real-time on the map."
                                }
                            ].map((feature, i) => (
                                <div
                                    key={i}
                                    className="p-8 rounded-2xl bg-gray-900/60 backdrop-blur-md border border-gray-800 hover:border-gray-700 transition-all group"
                                >
                                    <div className="w-16 h-16 bg-linear-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <div className="text-white">{feature.icon}</div>
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                                    <p className="text-gray-400">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-black/50 backdrop-blur-md border-t border-gray-800 py-12 px-6">
                    <div className="max-w-7xl mx-auto text-center text-gray-400 text-sm">
                        <p>&copy; 2025 UberX Clone. Made with <span className="text-red-500">❤</span> for learning.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
/**
 
 */
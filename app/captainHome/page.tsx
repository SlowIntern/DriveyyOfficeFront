"use client";

import { Car, Menu, X, MapPin, Wallet, Timer, Star } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import api from "../lib/api";

export default function CaptainHomePage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [online, setOnline] = useState(false);

    const  toggleOnline = async () => {
        if (!online)
        {
            await api.post("/captain/online");
            setOnline(true);
        }
        else
        {
            await api.post("/captain/offline");
            setOnline(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden relative">

            {/* Animated Background Orbs */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-20 left-20 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute top-40 right-32 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
                <div className="absolute bottom-32 left-1/3 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-500"></div>
            </div>

            {/* NAVBAR */}
            <nav className="relative z-50 backdrop-blur-lg bg-black/40 border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-linear-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                            <Car className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            UberX Captain
                        </span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="#" className="text-gray-300 hover:text-white transition-all">Home</Link>
                        <Link href="#" className="text-gray-300 hover:text-white transition-all">Rides</Link>
                        <Link href="#" className="text-gray-300 hover:text-white transition-all">Earnings</Link>
                        <Link href="#" className="text-gray-300 hover:text-white transition-all">Profile</Link>

                        <button className="px-5 py-2 bg-linear-to-r from-blue-600 to-purple-600 rounded-full font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all">
                            Logout
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {mobileMenuOpen && (
                    <div className="md:hidden bg-black/95 backdrop-blur-lg border-b border-gray-800">
                        <div className="px-6 py-4 space-y-4">
                            <Link href="#" className="block text-lg text-gray-300 hover:text-white">Home</Link>
                            <Link href="#" className="block text-lg text-gray-300 hover:text-white">Rides</Link>
                            <Link href="#" className="block text-lg text-gray-300 hover:text-white">Earnings</Link>
                            <Link href="#" className="block text-lg text-gray-300 hover:text-white">Profile</Link>
                            <button className="w-full py-3 bg-linear-to-r from-blue-600 to-purple-600 rounded-full font-medium">
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            {/* CAPTAIN MAIN SECTION */}
            <section className="relative z-10 max-w-7xl mx-auto px-6 py-14">
                <h1 className="text-4xl md:text-5xl font-bold mb-10">
                    Welcome Captain 👋
                </h1>

                {/* ONLINE/OFFLINE CARD */}
                <div className="p-8 rounded-3xl bg-gray-900/70 backdrop-blur-xl border border-gray-700 shadow-xl mb-12">
                    <h2 className="text-2xl font-bold mb-4">Availability</h2>

                    <div className="flex items-center justify-between">
                        <span className="text-lg text-gray-300">Status:</span>
                        <button
                            onClick={toggleOnline}
                            className={`px-6 py-3 rounded-xl font-semibold transition-all 
                                ${online
                                    ? "bg-green-600 hover:bg-green-700"
                                    : "bg-red-600 hover:bg-red-700"
                                }`}
                        >
                            {online ? "Online" : "Offline"}
                        </button>
                    </div>
                </div>

                {/* EARNINGS + RATINGS + HOURS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {/* Earnings */}
                    <div className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800 backdrop-blur-lg">
                        <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-4">
                            <Wallet className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-1">Today's Earnings</h3>
                        <p className="text-3xl font-bold text-green-400">₹850</p>
                    </div>

                    {/* Hours Online */}
                    <div className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800 backdrop-blur-lg">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                            <Timer className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-1">Hours Online</h3>
                        <p className="text-3xl font-bold text-blue-400">3h 45m</p>
                    </div>

                    {/* Rating */}
                    <div className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800 backdrop-blur-lg">
                        <div className="w-12 h-12 bg-yellow-600 rounded-xl flex items-center justify-center mb-4">
                            <Star className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-1">Your Rating</h3>
                        <p className="text-3xl font-bold text-yellow-400">4.88</p>
                    </div>
                </div>

                {/* Recent Requests */}
                <div>
                    <h2 className="text-3xl font-bold mb-6">Recent Ride Requests</h2>

                    <div className="grid grid-cols-1 gap-6">
                        {["Sector 17 → Zirakpur", "Mohali → Chandigarh Airport", "Elante Mall → Sector 40"]
                            .map((ride, i) => (
                                <div
                                    key={i}
                                    className="p-6 rounded-xl bg-gray-900/60 border border-gray-800 backdrop-blur-md flex justify-between items-center"
                                >
                                    <div>
                                        <h3 className="text-xl font-semibold">{ride}</h3>
                                        <p className="text-gray-400 text-sm">5 mins ago</p>
                                    </div>
                                    <MapPin className="w-8 h-8 text-blue-400" />
                                </div>
                            ))
                        }
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black/50 backdrop-blur-md border-t border-gray-800 py-12 px-6">
                <div className="max-w-7xl mx-auto text-center text-gray-400 text-sm">
                    <p>&copy; 2025 UberX Captain Dashboard. Learn & Build 🚀</p>
                </div>
            </footer>
        </div>
    );
}

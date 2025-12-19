"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import socket from "../lib/socket";
import api from "../lib/api";
import { toast, ToastContainer } from "react-toastify";
import Link from "next/link";
import ORSMap from "../components/ORSMap";

type User = {
    _id: string;
    email: string;
    role: "user" | "captain";
};

type Ride = {
    _id: string;
    rideId: string;
    userId: string;
    captainId: string;
    pickup: string;
    destination: string;
    otp: string;
    status: string;
    rideType: string;
};

type ChatMessage = {
    sender: "You" | "Other";
    text: string;
};

export default function ChatUI() {
    const [ride, setRide] = useState<Ride | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState<ChatMessage[]>([]);
    const chatEndRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();

    // ---------------- FETCH USER ----------------
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get("/auth/profile");
                setUser(res.data);
            } catch {
                router.push("/Login");
            }
        };
        fetchUser();
    }, [router]);

    // ---------------- FETCH RIDE DETAILS ----------------
    useEffect(() => {
        const fetchRide = async () => {
            try {
                const rideId = localStorage.getItem("rideId");
                if (!rideId) return;

                const res = await api.get("rides/currentride", { params: { rideId } });
                setRide(res.data);

                if (res.data.status === "completed") {
                    toast.success("Ride Completed, redirecting to summary...");
                    setTimeout(() => router.push("/summary"), 2000);
                }
            } catch {
                toast.error("Error loading current ride");
            }
        };

        fetchRide();
        const interval = setInterval(fetchRide, 2000);
        return () => clearInterval(interval);
    }, [router]);

    // ---------------- SOCKET SETUP ----------------
    useEffect(() => {
        if (!user || !ride) return;

        // Register user socket
        socket.emit("register-socket", { userId: user._id, role: user.role });

        const handleRegistered = () => {
            const currentRideId = ride.rideId || ride._id;
            if (currentRideId) socket.emit("join-room", { rideId: currentRideId });
        };

        socket.on("registered", handleRegistered);

        // Listen for ride-ended event
        const handleRideEnded = () => {
            toast.info("Your ride has ended!");
            if (user.role === "user") router.push("/home");
        };
        socket.on("ride-ended", handleRideEnded);

        // Listen for incoming messages
        const handleMessage = (data: { fromId: string; message: string }) => {
            if (data.fromId === user._id) return; // Ignore own messages
            setChat((prev) => [...prev, { sender: "Other", text: data.message }]);
        };
        socket.on("receive-message", handleMessage);

        return () => {
            socket.off("registered", handleRegistered);
            socket.off("ride-ended", handleRideEnded);
            socket.off("receive-message", handleMessage);
        };
    }, [user, ride, router]);

    // ---------------- SCROLL TO BOTTOM ----------------
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat]);

    // ---------------- SEND MESSAGE ----------------
    const sendMessage = () => {
        if (!ride || !user || !message.trim()) return;

        const receiverId = user.role === "user" ? ride.captainId : ride.userId;

        socket.emit("send-message", {
            rideId: ride.rideId || ride._id,
            fromId: user._id,
            toId: receiverId,
            message,
        });

        setChat((prev) => [...prev, { sender: "You", text: message }]);
        setMessage("");
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center justify-start relative">
            {ride && (
                <div className="w-full max-w-3xl flex flex-col gap-4 mb-6">
                    {/* Ride Details */}
                    <div className="bg-gray-800 p-4 rounded-xl shadow border border-gray-700">
                        <h2 className="text-xl font-bold text-blue-400 mb-2">Ride Details</h2>
                        <p><span className="font-semibold">Ride ID:</span> {ride.rideId || ride._id}</p>
                        <p><span className="font-semibold">Pickup:</span> {ride.pickup}</p>
                        <p><span className="font-semibold">Destination:</span> {ride.destination}</p>
                        <p><span className="font-semibold">User ID:</span> {ride.userId}</p>
                        <p><span className="font-semibold">Captain ID:</span> {ride.captainId}</p>
                        <p><span className="font-semibold">OTP:</span> {ride.otp}</p>
                        <p><span className="font-semibold">Ride Type:</span> {ride.rideType}</p>
                    </div>

                    <div className="w-full h-48 rounded-xl overflow-hidden border border-gray-700">
                        <ORSMap pickup={ride.pickup!} destination={ride.destination!} />
                    </div>
                </div>
            )}

            {/* Chat Section */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md flex flex-col">
                {!ride ? (
                    <p className="text-gray-300 text-center">Loading current ride...</p>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold mb-4 text-blue-400">
                            Chat for Ride: {ride.rideId || ride._id}
                        </h2>

                        <div className="flex-1 border border-gray-700 rounded p-3 mb-4 h-64 overflow-y-auto bg-gray-900">
                            {chat.map((msg, idx) => (
                                <div key={idx} className={`mb-2 ${msg.sender === "You" ? "text-right" : "text-left"}`}>
                                    <span className="font-semibold text-blue-400">{msg.sender}:</span>{" "}
                                    <span className="text-gray-300">{msg.text}</span>
                                </div>
                            ))}
                            <div ref={chatEndRef}></div>
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Type your message..."
                                className="flex-1 p-2 rounded border border-gray-700 bg-gray-900 text-white"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            />
                            <button
                                onClick={sendMessage}
                                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white font-semibold"
                            >
                                Send
                            </button>

                            {user?.role === "captain" && (
                                <Link
                                    href="/acceptRide"
                                    className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded text-white font-semibold"
                                >
                                    Start Ride
                                </Link>
                            )}
                        </div>
                    </>
                )}
            </div>

            <ToastContainer position="top-right" autoClose={3000} theme="dark" />
        </div>
    );
}

"use client";

import { useEffect, useState, useRef } from "react";
import socket from "../lib/socket";
import api from "../lib/api";
import { toast, ToastContainer } from "react-toastify";
import Link from "next/link";
import ORSMap from "../components/ORSMap";

type Ride = {
    rideId: string;
    captainsocketId: string;
    usersocketId: string;
};

type ChatMessage = {
    sender: string;
    text: string;
};

export default function ChatUI() {
    const [ride, setRide] = useState<Ride | null>(null);
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState<ChatMessage[]>([]);
    const chatEndRef = useRef<HTMLDivElement | null>(null);

    async function fetchRideDetail() {
        try {
            const res = await api.get("rides/currentride");
            setRide(res.data);
        } catch (error) {
            console.log(error);
            toast.error("Error loading current ride");
        }
    }

    useEffect(() => {
        fetchRideDetail();
    }, []);

    useEffect(() => {
        socket.on("receive-message", (data: any) => {
            setChat((prev) => [...prev, { sender: data.fromId, text: data.message }]);
        });

        return () => {
            socket.off("receive-message");
        };
    }, []);

    useEffect(() => {
        // Scroll to bottom when new message arrives
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat]);

    const sendMessage = () => {
        if (!ride) return;
        if (!message.trim()) return;

        const senderId = ride.usersocketId;
        const receiverId = ride.captainsocketId;

        const msgObj = {
            rideId: ride.rideId,
            fromId: senderId,
            toId: receiverId,
            message,
        };

        socket.emit("send-message", msgObj);

        setChat((prev) => [...prev, { sender: "You", text: message }]);
        setMessage("");
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center justify-center relative overflow-hidden">
            <ORSMap pickup={[28.6139, 77.2090]} destination={[28.7041, 77.1025]} /> {/*add dynamic value here*/}
            
            {/* Background gradients */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-10 left-10 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute top-40 right-20 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-500"></div>
                <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md flex flex-col">
                {!ride ? (
                    <p className="text-gray-300 text-center">Loading current ride...</p>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold mb-4 text-blue-400">
                            Chat for Ride: {ride.rideId}
                        </h2>

                        {/* Chat box */}
                        <div className="flex-1 border border-gray-700 rounded p-3 mb-4 h-80 overflow-y-auto bg-gray-900">
                            {chat.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`mb-2 ${msg.sender === "You" ? "text-right" : "text-left"
                                        }`}
                                >
                                    <span className="font-semibold text-blue-400">
                                        {msg.sender}:
                                    </span>{" "}
                                    <span className="text-gray-300">{msg.text}</span>
                                </div>
                            ))}
                            <div ref={chatEndRef}></div>
                        </div>

                        {/* Input + Send */}
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
                                <Link
                                    href="/acceptRide"
                                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white font-semibold"
                                >
                                    start ride
                                </Link>
                        </div>
                    </>
                )}
            </div>

            <ToastContainer position="top-right" autoClose={3000} theme="dark" />
        </div>
    );
}



<>IsIT working</>
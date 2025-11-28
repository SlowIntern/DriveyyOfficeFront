"use client";

import { useEffect, useState } from "react";
import socket from "../lib/socket";
import api from "../lib/api";
import { toast } from "react-toastify";

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
        <div className="p-4 max-w-md mx-auto">
            {!ride ? (
                <p>Loading...</p>
            ) : (
                <>
                    <h2 className="text-xl font-semibold mb-4">
                        Chat for Ride: {ride.rideId}
                    </h2>

                
                    <div className="border p-3 rounded h-80 overflow-y-auto bg-gray-100 mb-4">
                        {chat.map((msg, idx) => (
                            <div key={idx} className="mb-2">
                                <strong>{msg.sender}: </strong>
                                <span>{msg.text}</span>
                            </div>
                        ))}
                    </div>

                    {/* INPUT */}
                    <input
                        className="border p-2 rounded w-full mb-3"
                        placeholder="Type message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />

                    {/* SEND Btn */}
                    <button
                        onClick={sendMessage}
                        className="px-4 py-2 bg-blue-500 text-white rounded w-full"
                    >
                        Send
                    </button>
                </>
            )}
        </div>
    );
}

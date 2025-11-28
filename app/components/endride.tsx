"use client"
import { toast } from "react-toastify";
import api from "../lib/api";

export default function EndRide() {

    const end = async () => {
        try {
            await api.get("/rides/endridebyme")
            toast.success("Ride ended successfully!")
        } catch (error) {
            toast.error("Error ending ride")
        }

    }

    return (
        <button onClick={end}>End Ride</button>
    );
}
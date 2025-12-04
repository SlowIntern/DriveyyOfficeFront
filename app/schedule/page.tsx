"use client";
import React, { useState } from "react";
import api from "../lib/api";
import { Calendar, Clock, MapPin, Navigation, Car } from "lucide-react";

type VehicleType = "auto" | "car" | "moto";

type ScheduleDto = {
    pickup: string;
    destination: string;
    date: string;
    time: string;
    vehicleType: VehicleType;
};

export default function RideSchedulePage() {
    const [form, setForm] = useState<ScheduleDto>({
        pickup: "",
        destination: "",
        date: "",
        time: "",
        vehicleType: "auto",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [responseData, setResponseData] = useState<any>(null);

    const onChange = <K extends keyof ScheduleDto>(key: K, value: ScheduleDto[K]) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const validate = (): string | null => {
        if (!form.pickup.trim()) return "Pickup is required";
        if (!form.destination.trim()) return "Destination is required";
        if (!form.date) return "Date is required";
        if (!form.time) return "Time is required";
        return null;
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        setError(null);
        setSuccess(null);
        setResponseData(null);

        const validationErr = validate();
        if (validationErr) return setError(validationErr);

        setLoading(true);

        try {
           // const res = await api.post("/ride-schedule/scheduleRide");
            const res = await api.post("ride-schedule/scheduleRide", form);
            const body = res.data;
            setSuccess(body?.message || "Ride scheduled successfully!");
            setResponseData(body);

        } catch (err: any) {
            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Failed to schedule ride";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center px-4 py-10 overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-black">

            {/* --- Floating Gradient Orbs --- */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute w-72 h-72 bg-blue-600/30 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
                <div className="absolute w-72 h-72 bg-purple-600/30 rounded-full blur-3xl bottom-10 right-10 animate-pulse"></div>
            </div>

            {/* --- Card --- */}
            <div className="w-full max-w-xl p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl">

                <h1 className="text-3xl font-semibold text-white text-center mb-6">
                    Schedule a Ride
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Pickup */}
                    <div>
                        <label className="text-white text-sm font-medium">Pickup</label>
                        <div className="relative mt-1">
                            <MapPin className="absolute left-3 top-3 text-purple-300" size={18} />
                            <input
                                value={form.pickup}
                                onChange={(e) => onChange("pickup", e.target.value)}
                                className="w-full bg-white/10 text-white border border-white/20 rounded-lg py-2.5 pl-10 pr-3 placeholder-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
                                placeholder="Enter pickup location"
                            />
                        </div>
                    </div>

                    {/* Destination */}
                    <div>
                        <label className="text-white text-sm font-medium">Destination</label>
                        <div className="relative mt-1">
                            <Navigation className="absolute left-3 top-3 text-blue-300" size={18} />
                            <input
                                value={form.destination}
                                onChange={(e) => onChange("destination", e.target.value)}
                                className="w-full bg-white/10 text-white border border-white/20 rounded-lg py-2.5 pl-10 pr-3 placeholder-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Enter destination"
                            />
                        </div>
                    </div>

                    {/* Date + Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-white text-sm font-medium">Date</label>
                            <div className="relative mt-1">
                                <Calendar className="absolute left-3 top-3 text-green-300" size={18} />
                                <input
                                    type="date"
                                    value={form.date}
                                    onChange={(e) => onChange("date", e.target.value)}
                                    className="w-full bg-white/10 text-white border border-white/20 rounded-lg py-2.5 pl-10 pr-3 focus:ring-2 focus:ring-green-500 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-white text-sm font-medium">Time</label>
                            <div className="relative mt-1">
                                <Clock className="absolute left-3 top-3 text-yellow-300" size={18} />
                                <input
                                    type="time"
                                    value={form.time}
                                    onChange={(e) => onChange("time", e.target.value)}
                                    className="w-full bg-white/10 text-white border border-white/20 rounded-lg py-2.5 pl-10 pr-3 focus:ring-2 focus:ring-yellow-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Vehicle Type */}
                    <div>
                        <label className="text-white text-sm font-medium">Vehicle Type</label>
                        <div className="relative mt-1">
                            <Car className="absolute left-3 top-3 text-cyan-300" size={18} />
                            <select
                                value={form.vehicleType}
                                onChange={(e) => onChange("vehicleType", e.target.value as VehicleType)}
                                className="w-full bg-white/10 text-white border border-white/20 rounded-lg py-2.5 pl-10 pr-3 focus:ring-2 focus:ring-cyan-500 outline-none"
                            >
                                <option className="text-black" value="auto">Auto</option>
                                <option className="text-black" value="car">Car</option>
                                <option className="text-black" value="moto">Moto</option>
                            </select>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center gap-3 pt-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-lg text-white font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 disabled:opacity-60 shadow-lg"
                        >
                            {loading ? "Scheduling..." : "Schedule Ride"}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setForm({
                                    pickup: "",
                                    destination: "",
                                    date: "",
                                    time: "",
                                    vehicleType: "auto",
                                });
                                setSuccess(null);
                                setError(null);
                                setResponseData(null);
                            }}
                            className="px-4 py-3 border border-white/20 text-white rounded-lg hover:bg-white/10"
                        >
                            Reset
                        </button>
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="text-red-400 text-sm bg-red-900/20 p-2 rounded">
                            {error}
                        </p>
                    )}

                    {/* Success */}
                    {success && (
                        <p className="text-green-400 text-sm bg-green-900/20 p-2 rounded">
                            {success}
                        </p>
                    )}

                    {/* Response Preview */}
                    {responseData && (
                        <pre className="bg-black/30 border border-white/10 p-3 rounded text-white text-xs overflow-auto">
                            {JSON.stringify(responseData, null, 2)}
                        </pre>
                    )}
                </form>
            </div>
        </div>
    );
}

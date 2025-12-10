"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/app/lib/api";
import { toast } from "react-toastify";

export default function CaptainDetailPage() {
    const { id } = useParams(); // This will get the id from the url path.....
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [verifying, setVerifying] = useState(false);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                const res = await api.get(`/admin/captains/${id}`);
                setData(res.data);
            } catch (err: any) {
                console.error(err);
                setError("Failed to fetch captain details");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleVerify = async () => {
        if (!id) return;
        setVerifying(true);
        try {
            await api.post(`/admin/verify`, { captainId: id });
            toast.success("Captain verified successfully!");
            setData((prev: any) => ({
                ...prev,
                captain: { ...prev.captain, isVerified: true },
            }));
        } catch (err) {
            console.error(err);
            toast.error("Failed to verify captain");
        } finally {
            setVerifying(false);
        }
    };

    if (loading) return <p className="text-center mt-10">Loading...</p>;
    if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
    if (!data) return <p className="text-center mt-10">No data found</p>;

    const { captain, documents } = data;

    return (
        <div className="min-h-screen p-8 bg-gray-900 text-white max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Captain Profile</h1>

            {/* Captain Info */}
            <div className="mb-8 bg-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold mb-2">
                    {captain.firstName} {captain.lastName}
                </h2>
                <p>Email: {captain.email}</p>
                <p>
                    Vehicle: {captain.vehicle.color} - {captain.vehicle.plate} (
                    {captain.vehicle.vehicleType})
                </p>
                <p>Verified: {captain.isVerified ? "✅" : "❌"}</p>

                {!captain.isVerified && (
                    <button
                        onClick={handleVerify}
                        disabled={verifying}
                        className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                    >
                        {verifying ? "Verifying..." : "Verify Captain"}
                    </button>
                )}
            </div>

            {/* Documents */}
            <h2 className="text-2xl font-bold mb-4">Uploaded Documents</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {Object.entries(documents).map(([key, url]) => (
                    <div
                        key={key}
                        className="bg-gray-800 p-4 rounded-xl shadow-lg"
                    >
                        <h3 className="font-semibold mb-2 capitalize">{key}</h3>
                        {typeof url === "string" && (
                            <img
                                src={url}
                                alt={key}
                                className="w-full h-40 object-contain rounded"
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

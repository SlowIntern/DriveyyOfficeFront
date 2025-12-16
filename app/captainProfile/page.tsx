"use client";

import { useEffect, useState } from "react";
import api from "../lib/api";
import { toast } from "react-toastify";
import { Camera, FileCheck } from "lucide-react";

/* ===================== TYPES ===================== */

type CaptainData = {
    _id: string;
    firstName: string;
    lastname: string;
    email: string;
    status: string;
    isverified: boolean;
    totalEarnings: number;
};

type VerifiedDocs = {
    _id: string;
    aadhaarFront?: string;
    aadhaarBack?: string;
    panCard?: string;
    licenseFront?: string;
    licenseBack?: string;
    rcFront?: string;
    rcBack?: string;
    profilePhoto?: string;
    captain: CaptainData;
};

/* ===================== COMPONENT ===================== */

export default function CaptainProfilePage() {
    const [data, setData] = useState<VerifiedDocs | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await api.get("/verified-service/verifyCap");

                // API returns array → take first item
                if (res.data && res.data.length > 0) {
                    setData(res.data[0]);
                } else {
                    toast.info("No verification data found");
                }
            } catch (error) {
                toast.error("Error loading captain profile");
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="h-screen flex justify-center items-center text-white text-xl">
                Loading profile...
            </div>
        );
    }

    if (!data) {
        return (
            <div className="h-screen flex justify-center items-center text-gray-400">
                No data available
            </div>
        );
    }

    const { captain } = data;

    return (
        <div className="min-h-screen p-10 bg-gray-900 text-white">
            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <h1 className="text-4xl font-bold text-center mb-10 bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-400">
                    Captain Profile
                </h1>

                <div className="relative p-8 rounded-2xl shadow-lg bg-gray-900/60 border border-gray-700 backdrop-blur-md">

                    {/* Profile Section */}
                    <div className="flex flex-col items-center space-y-4 mb-10">
                        <div className="relative w-32 h-32">
                            <img
                                src={
                                    data.profilePhoto ||
                                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                }
                                alt="profile"
                                className="w-32 h-32 rounded-full object-cover border border-gray-700"
                            />
                            <Camera className="absolute bottom-2 right-2 w-6 h-6 text-white bg-black/50 rounded-full p-1" />
                        </div>

                        <h2 className="text-2xl font-semibold">
                            {captain.firstName} {captain.lastname}
                        </h2>

                        <p className="text-gray-300">{captain.email}</p>

                        <span
                            className={`px-4 py-1 rounded-full text-sm font-semibold ${captain.isverified
                                    ? "bg-green-600/30 text-green-300 border border-green-600"
                                    : "bg-yellow-600/20 text-yellow-300 border border-yellow-600"
                                }`}
                        >
                            {captain.isverified ? "Verified" : "Pending Verification"}
                        </span>

                        <p className="text-sm text-gray-400">
                            Total Earnings: ₹{captain.totalEarnings}
                        </p>
                    </div>

                    {/* Documents Section */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <FileCheck className="w-6 h-6 text-blue-400" />
                            Uploaded Documents
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {renderDoc("Aadhaar Front", data.aadhaarFront)}
                            {renderDoc("Aadhaar Back", data.aadhaarBack)}
                            {renderDoc("PAN Card", data.panCard)}
                            {renderDoc("License Front", data.licenseFront)}
                            {renderDoc("License Back", data.licenseBack)}
                            {renderDoc("RC Front", data.rcFront)}
                            {renderDoc("RC Back", data.rcBack)}
                        </div>
                    </div>

                    {/* Edit Button */}
                    {/* <div className="mt-10 text-center">
                        <button className="px-8 py-3 bg-linear-to-r from-blue-600 to-purple-600 rounded-xl font-semibold hover:scale-105 transition-all">
                            Edit Profile
                        </button>
                    </div> */}

                </div>
            </div>
        </div>
    );
}

/* ===================== HELPER ===================== */

function renderDoc(label: string, url?: string) {
    return (
        <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
            <h4 className="font-semibold text-gray-300 mb-2">{label}</h4>
            {url ? (
                url.endsWith(".pdf") ? (
                    <a
                        href={url}
                        target="_blank"
                        className="text-blue-400 underline text-sm"
                    >
                        View PDF
                    </a>
                ) : (
                    <img
                        src={url}
                        alt={label}
                        className="w-full h-40 object-cover rounded-lg border border-gray-700"
                    />
                )
            ) : (
                <p className="text-gray-500 text-sm">No file uploaded</p>
            )}
        </div>
    );
}

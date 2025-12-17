"use client";

import { useEffect, useState } from "react";
import api from "../lib/api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";


type Captain = {
    _id: string;
    email: string;
    role: "user" | "captain";
};

export default function VerifyPage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [captain, setCaptain] = useState<Captain | null>(null);
    const router = useRouter();

    useEffect(() => {
        async function fetchCaptain() {
            try {
                const res = await api.get("/auth/profile");
                setCaptain(res.data);
            
            } catch (error) {
                toast.error("Error fetching captain info");
            }
        }

        fetchCaptain();
    }, []); // run only once


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);

        const res = await fetch("http://localhost:3000/verified-service/upload", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        setMessage(JSON.stringify(data, null, 2));
        setLoading(false);

        router.push("/captainHome");
    };

    return (
        <div className="min-h-screen p-10 bg-gray-900 text-white">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-extrabold text-center mb-10 text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-cyan-400">
                    Upload Verification Documents
                </h1>

                {/* Upload Card */}
                <div className="relative p-8 rounded-2xl shadow-lg bg-gray-900/60 border border-gray-700 backdrop-blur-md">
                    <div className="absolute inset-0 -z-10 bg-linear-to-br from-indigo-500/30 to-purple-700/30 rounded-2xl blur-xl opacity-40" />

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <UploadInput label="Aadhaar Front" name="aadhaarFront" />
                        <UploadInput label="Aadhaar Back" name="aadhaarBack" />
                        <UploadInput label="PAN Card" name="panCard" />
                        <UploadInput label="License Front" name="licenseFront" />
                        <UploadInput label="License Back" name="licenseBack" />
                        <UploadInput label="RC Front" name="rcFront" />
                        <UploadInput label="RC Back" name="rcBack" />
                        <UploadInput label="Profile Photo" name="profilePhoto" />

                        {/* Captain ID */}
                        <div>
                            <label className="block mb-1 text-gray-300" hidden>Captain ID</label>
                            <input
                                type="text"
                                name="captainId"
                                defaultValue={captain?._id}
                                hidden
                              
                                placeholder="Enter captain's ObjectId"
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 rounded-xl text-lg font-semibold transition 
                            bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400`}
                        >
                            {loading ? "Uploading..." : "Upload Documents"}
                        </button>
                    </form>
                </div>

                {message && (
                    <pre className="mt-10 p-6 rounded-xl bg-gray-800 border border-gray-700 text-green-300">
                        {message}
                    </pre>
                )}
            </div>
        </div>
    );
}

// --- COMPONENTS ---

function UploadInput({ label, name }: { label: string; name: string }) {
    return (
        <div>
            <label className="block mb-1 text-gray-300">{label}</label>
            <input
                type="file"
                name={name}
                required
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl 
                file:bg-gray-700 file:border-0 file:px-4 file:py-2 file:mr-4 file:rounded-lg 
                cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
        </div>
    );
}

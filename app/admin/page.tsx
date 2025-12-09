"use client";

import { useEffect, useState } from "react";
import api from "../lib/api";
import { toast } from "react-toastify";



export default function AdminDashboard() {
    const [stats, setStats] = useState<{ users: number; captains: number; rides: number } | null>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [captains, setCaptains] = useState<any[]>([]);
    const [rides, setRides] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState("users");

    useEffect(() => {
        fetchStats();
        fetchUsers();
        fetchCaptains();
        fetchRides();
    }, []);

    // ---- API CALLS ----
    async function fetchStats() {
        const res = await fetch("http://localhost:3000/admin/stats");
        setStats(await res.json());
    }

    async function fetchUsers() {
        const { data }  = await api.get("admin/users");
        setUsers(data);
    }

    async function fetchCaptains() {
        const { data } =await api.get("admin/captains");
        setCaptains(data);
    }

    async function fetchRides() {
        const {data} = await api.get("admin/rides");
        setRides(data);
    }

    async function handleDeleteUser() {
        await api.delete(`admin/users`);
        fetchUsers();
    }


 


    return (
        <div className="min-h-screen p-8 bg-gray-900 text-white">

            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-extrabold text-center mb-10 text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-cyan-400">
                    Admin Dashboard
                </h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">

                    <DashboardCard title="Total Users" value={stats?.users ?? "..."} gradient="from-indigo-500/40 to-indigo-700/40" />
                    <DashboardCard title="Total Captains" value={stats?.captains ?? "..."} gradient="from-purple-500/40 to-purple-700/40" />
                    <DashboardCard title="Total Rides Booked" value={stats?.rides ?? "..."} gradient="from-cyan-500/40 to-cyan-700/40" />

                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-6">
                    <TabButton label="Users" active={activeTab === "users"} onClick={() => setActiveTab("users")} />
                    <TabButton label="Captains" active={activeTab === "captains"} onClick={() => setActiveTab("captains")} />
                    <TabButton label="Rides" active={activeTab === "rides"} onClick={() => setActiveTab("rides")} />
                </div>

                {/* TABLE RENDERING */}
                {activeTab === "users" && <DataTable data={users} type="users" />}
                {activeTab === "captains" && <DataTable data={captains} type="captains" />}
                {activeTab === "rides" && <DataTable data={rides} type="rides" />}

            </div>
        </div>
    );
}

// --- COMPONENTS ---

function DashboardCard({ title, value, gradient }: any) {
    return (
        <div className="relative p-6 rounded-2xl shadow-lg bg-gray-900/60 border border-gray-700 backdrop-blur-md">
            <div className={`absolute inset-0 -z-10 bg-linear-to-br ${gradient} rounded-2xl blur-2xl opacity-50`} />
            <h2 className="text-xl">{title}</h2>
            <p className="text-4xl font-bold mt-3">{value}</p>
        </div>
    );
}

function TabButton({ label, active, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-lg text-lg font-semibold border 
                ${active ? "bg-indigo-600 border-indigo-400" : "border-gray-600"}
            `}
        >
            {label}
        </button>
    );
}

function DataTable({ data, type }: { data: any[]; type: string }) {

    const handleVerify = async (captainId: string) => {
        try {
            // Call your backend API
            const res = await api.post("/admin/verify", { captainId });
            toast.success("Captain verified!");
            console.log(res.data);
        } catch (error) {
            toast.error("Failed to verify captain");
            console.error(error);
        }
    };

    if (data.length === 0) {
        return <p className="text-center text-gray-400 mt-10">No {type} found.</p>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border border-gray-700 rounded-lg overflow-hidden">
                <thead className="bg-gray-800">
                    <tr>
                        {Object.keys(data[0]).map((key) => (
                            <th
                                key={key}
                                className="px-4 py-3 border-b border-gray-700 capitalize"
                            >
                                {key}
                            </th>
                        ))}
                        <th className="px-4 py-3 border-b border-gray-700">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, i) => (
                        <tr key={i} className="hover:bg-gray-800/40">
                            {Object.values(item).map((val: any, j) => (
                                <td
                                    key={j}
                                    className="px-4 py-3 border-b border-gray-800 text-gray-300"
                                >
                                    {String(val)}
                                </td>
                            ))}

                            {/* Action buttons */}
                            <td className="px-4 py-3 border-b border-gray-800 flex gap-2">
                                <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                                    Delete
                                </button>

                                <button
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                    onClick={() => handleVerify(item._id)}
                                >
                                    Verify
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

}

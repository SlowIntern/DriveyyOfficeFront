"use client";
import { useForm } from "react-hook-form";
import api from "../lib/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Vehicle = {
    color: string;
    plate: string;
    capacity: number;
    vehicleType: "car" | "motorcycle" | "auto";
};

type CapRegister = {
    firstName: string;
    lastname: string;
    email: string;
    password: string;
    vehicle: Vehicle;
};

export default function CaptainRegisterPage() {
    const { register, handleSubmit, reset } = useForm<CapRegister>();

    const onSubmit = async (data: CapRegister) => {
        try {
            const res = await api.post("/auth/cap/register", data);
            console.log(res.data);
            toast.success(res.data.message);
            reset();
        } catch (error) {
            console.error(error);
            toast.error("Captain Registration Failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-black text-white">
            <div className="relative w-full max-w-md p-8 rounded-2xl shadow-2xl bg-opacity-90 bg-gray-900 border border-gray-700 backdrop-blur-md">
                {/* subtle glowing gradient effect */}
                <div className="absolute inset-0 -z-10 bg-linear-to-tr from-indigo-500/30 via-blue-500/20 to-cyan-400/20 rounded-2xl blur-3xl opacity-70" />

                <h2 className="text-3xl font-extrabold text-center mb-6 bg-linear-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                    Captain Registration
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Personal Info */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            First Name
                        </label>
                        <input
                            {...register("firstName")}
                            placeholder="Enter your first name"
                            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Last Name
                        </label>
                        <input
                            {...register("lastname")}
                            placeholder="Enter your last name"
                            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Email
                        </label>
                        <input
                            {...register("email")}
                            type="email"
                            placeholder="you@example.com"
                            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            {...register("password")}
                            placeholder="••••••••"
                            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                        />
                    </div>

                    {/* Vehicle Details Section */}
                    <div className="mt-8 p-4 rounded-xl bg-gray-800/60 border border-gray-700 shadow-inner">
                        <h3 className="text-lg font-semibold mb-3 bg-linear-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                            Vehicle Details
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Vehicle Color
                                </label>
                                <input
                                    {...register("vehicle.color")}
                                    placeholder="e.g. Red"
                                    className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Plate Number
                                </label>
                                <input
                                    {...register("vehicle.plate")}
                                    placeholder="e.g. MH12AB1234"
                                    className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Capacity
                                </label>
                                <input
                                    type="number"
                                    {...register("vehicle.capacity")}
                                    placeholder="e.g. 4"
                                    className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Vehicle Type
                                </label>
                                <select
                                    {...register("vehicle.vehicleType")}
                                    className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
                                >
                                    <option value="">Select Vehicle Type</option>
                                    <option value="car">Car</option>
                                    <option value="motorcycle">Motorcycle</option>
                                    <option value="auto">Auto</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="mt-6 w-full py-2 font-semibold rounded-lg bg-linear-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 transition-all shadow-md hover:shadow-lg"
                    >
                        Register as Captain
                    </button>
                </form>

                <p className="text-center text-sm text-gray-400 mt-6">
                    Already registered?{" "}
                    <a
                        href="/login"
                        className="text-cyan-400 hover:text-cyan-300 font-medium transition-all"
                    >
                        Login
                    </a>
                </p>
            </div>

            <ToastContainer position="top-right" autoClose={3000} theme="dark" />
        </div>
    );
}

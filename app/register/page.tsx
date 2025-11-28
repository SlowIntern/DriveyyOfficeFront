"use client";
import { useForm } from "react-hook-form";
import api from "../lib/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";



type RegisterData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

export default function RegisterPage() {
    const { register, handleSubmit, reset } = useForm<RegisterData>();

    const onSubmit = async (data: RegisterData) => {
        try {
            const res = await api.post("/auth/register", data);
            toast.success(res.data.message);
            const route = useRouter();
            route.push("/home");
            reset();
        } catch (error) {
            console.error(error);
            toast.error("Registration failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-black text-white">
            <div className="relative w-full max-w-md p-8 rounded-2xl shadow-2xl bg-opacity-90 bg-gray-900 border border-gray-700 backdrop-blur-md">
                {/* subtle glowing border effect */}
                <div className="absolute inset-0 -z-10 bg-linear-to-tr from-blue-500/30 via-purple-500/20 to-pink-500/20 rounded-2xl blur-3xl opacity-70" />

                <h2 className="text-3xl font-extrabold text-center mb-6 bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Create an Account
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            First Name
                        </label>
                        <input
                            {...register("firstName")}
                            placeholder="Enter your first name"
                            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Last Name
                        </label>
                        <input
                            {...register("lastName")}
                            placeholder="Enter your last name"
                            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
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
                            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
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
                            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 font-semibold rounded-lg bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all shadow-md hover:shadow-lg"
                    >
                        Register
                    </button>
                </form>

                <p className="text-center text-sm text-gray-400 mt-6">
                    Already have an account?{" "}
                    <a
                        href="/Login"
                        className="text-blue-400 hover:text-blue-300 font-medium transition-all"
                    >
                        Login
                    </a>
                </p>
            </div>

            <ToastContainer position="top-right" autoClose={3000} theme="dark" />
        </div>
    );
}

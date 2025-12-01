"use client";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

type LoginData = {
    email: string;
    password: string;
    role: "user" | "captain";
};

export default function LoginPage() {
    const { register, handleSubmit, reset } = useForm<LoginData>();
    const { login } = useAuth();
    const router = useRouter();

    const onSubmit = async (data: LoginData) => {
        try {
            await login(data);
            toast.success("Logged in successfully!");
            reset();
            if (data.role === 'user')
            {
                router.push("/home");
            }
            else if(data.role){
                router.push("/captainHome");
            }
            else {
                router.push("/admin"); // also add a check for admin in backend
            }
       
            
        } catch (error) {
            console.error(error);
            toast.error("Login failed");
            throw error;
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-black text-white">
            <div className="relative w-full max-w-md p-8 rounded-2xl shadow-2xl bg-opacity-90 bg-gray-900 border border-gray-700 backdrop-blur-md">
                {/* glowing border */}
                <div className="absolute inset-0 -z-10 bg-linear-to-tr from-blue-500/30 via-purple-500/20 to-pink-500/20 rounded-2xl blur-3xl opacity-70" />

                <h2 className="text-3xl font-extrabold text-center mb-6 bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Welcome Back
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Role
                        </label>
                        <select
                            {...register("role")}
                            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                        >
                            <option value="user">User</option>
                            <option value="captain">Captain</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 font-semibold rounded-lg bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all shadow-md hover:shadow-lg"
                    >
                        Login
                    </button>
                </form>

                <p className="text-center text-sm text-gray-400 mt-6">
                    Don’t have an account?{" "}
                    <a
                        href="/register"
                        className="text-blue-400 hover:text-blue-300 font-medium transition-all"
                    >
                        Register
                    </a>
                </p>
            </div>

            <ToastContainer position="top-right" autoClose={1000} theme="dark" />
        </div>
    );
}

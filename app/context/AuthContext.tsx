'use client'
import { createContext, ReactNode, useEffect, useState } from "react";
import api from "../lib/api";

export type User = {
    userId: string;
    email: string;
    role: 'user' | 'captain';
};

type AuthContextType = {
    user: User | null;
    loading: boolean;
    login: (data: { email: string; password: string; role: 'user' | 'captain' }) => Promise<void>;
    logout: () => Promise<void>;
    fetchProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            const res = await api.get("/auth/profile");
            setUser(res.data);
        } catch (error) {
            setUser(null);  // ❗ Do NOT throw — just clear user
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile(); // load user on first page load
    }, []);

    const login = async (data: { email: string; password: string; role: 'user' | 'captain' }) => {
        try {
            await api.post("/auth/login", data);
            await fetchProfile();
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        await api.post("/auth/logout");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, fetchProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

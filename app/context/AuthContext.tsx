'use client'
import { createContext, ReactNode, useEffect, useState } from "react";
import api from "../lib/api";
import { toast } from "react-toastify";


export type User = {
    userId: string;
    email: string;
    role: 'user' | 'captain';
};

type AuthContextType = {
    user: User | null;
    loading: boolean;
    login: (data: { email: string; password: string; role: 'user' | "captain" }) => Promise<void>;
    logout: () => Promise<void>;
    fetchProfile: () => Promise<void>;
}


export const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            const res =await api.get("/auth/profile");
            setUser(res.data);
        }
        catch (error)
        {
         
           console.log("Why i am getting this fucking error")
        
           throw error;  // it neccesary otherwise get som comlexities

        }
        finally {
            setLoading(false);
        }
    }

    //  useEffect(() => {  // commenting this to stop fetch user functionality
    //      fetchProfile();
    //  }, []);


    const login = async (data: { email: string; password: string; role: 'user' | 'captain' }) => {
        try {
            const res = await api.post('/auth/login', data);
            // Wait 200ms to ensure cookie is saved in browser
           // await new Promise((resolve) => setTimeout(resolve, 200));

            await fetchProfile();
            
        }
        catch (error)
        {
            console.log(error);
            
            throw error;
        }
    }

    const logout = async () => {
        const res = api.post("/auth/logout");

        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, fetchProfile }}>
            {children}
        </AuthContext.Provider>
    );
    
}
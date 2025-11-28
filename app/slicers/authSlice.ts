import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../lib/api";
import { toast } from "react-toastify";

export type User = {
    userId: string;
    email: string;
    role: "user" | "captain";
};

type AuthState = {
    user: User | null;
    loading: boolean;
};

const initialState: AuthState = {
    user: null,
    loading: true
};

// -------- FETCH PROFILE ----------
export const fetchProfile = createAsyncThunk(
    "auth/fetchProfile",
    async (_, thunkAPI) => {
        try {
            const res = await api.get("/profile");
            return res.data;
        } catch (err) {
            toast.error("Fetching user data failed");
            return thunkAPI.rejectWithValue(err);
        }
    }
);

// -------- LOGIN ----------
export const login = createAsyncThunk(
    "auth/login",
    async (data: { email: string; password: string; role: "user" | "captain" }, thunkAPI) => {
        try {
            const res = await api.post("/login", data);
            await thunkAPI.dispatch(fetchProfile());
            return res.data;
        } catch (err) {
            toast.error("Login failed");
            return thunkAPI.rejectWithValue(err);
        }
    }
);

// -------- LOGOUT ----------
export const logout = createAsyncThunk(
    "auth/logout",
    async () => {
        await api.post("/logout");
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // FETCH PROFILE
            .addCase(fetchProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
            })
            .addCase(fetchProfile.rejected, (state) => {
                state.user = null;
                state.loading = false;
            })

            // LOGIN
            .addCase(login.fulfilled, (state) => {
                state.loading = false;
            })

            // LOGOUT
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
            });
    }
});

export default authSlice.reducer;

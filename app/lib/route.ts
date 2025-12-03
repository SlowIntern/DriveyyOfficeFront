import { NextResponse } from "next/server";
import api from "./api"; // axios instance

export async function POST(req: Request) {
    try {
        const { rideId } = await req.json();

        // Axios POST request
        const res = await api.post("/rides/payment", { rideId });

        // Axios stores response data in res.data
        return NextResponse.json(res.data);
    } catch (error: any) {
        console.error("Payment API Error:", error);

        return NextResponse.json(
            { error: "Payment creation failed" },
            { status: 500 }
        );
    }
}

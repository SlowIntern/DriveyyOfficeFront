"use client";

import dynamic from "next/dynamic";
const ORSMap = dynamic(() => import("../components/ORSMap"), { ssr: false });

export default function Maps() {
    const pickup: [number, number] = [28.6139, 77.2090];        // Delhi
    const destination: [number, number] = [28.7041, 77.1025];   // Some other place

    return (
        <div className="p-4">
            <h1 className="text-white mb-4">Maps</h1>
            <ORSMap pickup={pickup} destination={destination} />
        </div>
    );
}

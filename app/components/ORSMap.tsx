"use client";

import L from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Polyline, TileLayer, useMap } from "react-leaflet";

interface ORSMapProps {
    pickup: string;      // e.g., "New Delhi, India"
    destination: string; // e.g., "Noida, India"
}

// Custom start and end icons
const startIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [30, 40],
    iconAnchor: [15, 40],
});

const endIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [30, 40],
    iconAnchor: [15, 40],
});

// Fit map bounds to route
function FitBounds({ route }: { route: [number, number][] }) {
    const map = useMap();
    useEffect(() => {
        if (route.length > 0) {
            const bounds = L.latLngBounds(route);
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [route, map]);
    return null;
}

export default function ORSMap({ pickup, destination }: ORSMapProps) {
    const [coords, setCoords] = useState<{ pickup: [number, number]; destination: [number, number] } | null>(null);
    const [route, setRoute] = useState<[number, number][]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!pickup || !destination) return;

        const fetchCoordinates = async (location: string) => {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
            );
            const data = await res.json();
            if (!data.length) throw new Error(`Location not found: ${location}`);
            return [parseFloat(data[0].lat), parseFloat(data[0].lon)] as [number, number];
        };

        const fetchRoute = async () => {
            setLoading(true);
            try {
                // Get coordinates for pickup and destination
                const pickupCoords = await fetchCoordinates(pickup);
                const destinationCoords = await fetchCoordinates(destination);
                setCoords({ pickup: pickupCoords, destination: destinationCoords });

                //  Fetch route from OpenRouteService
                const response = await fetch(
                    "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
                    {
                        method: "POST",
                        headers: {
                            "Authorization": process.env.NEXT_PUBLIC_ORS_KEY!,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            coordinates: [
                                [pickupCoords[1], pickupCoords[0]],        // [lon, lat]
                                [destinationCoords[1], destinationCoords[0]] // [lon, lat]
                            ],
                        }),
                    }
                );

                const data = await response.json();

                if (!data.features?.length) {
                    console.error("No route returned from ORS", data);
                    setRoute([]);
                    return;
                }

                //  Convert ORS [lon, lat] → Leaflet [lat, lon]
                const routeCoords: [number, number][] = data.features[0].geometry.coordinates.map(
                    (c: any) => [Number(c[1]), Number(c[0])]
                );

                console.log("Route coordinates:", routeCoords); // debug
                setRoute(routeCoords);
            } catch (err) {
                console.error("Error fetching route:", err);
                setRoute([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRoute();
    }, [pickup, destination]);

    if (!coords) return <div>Loading map...</div>;

    return (
        <div className="w-full h-[400px] relative">
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 z-10">
                    <div className="w-16 h-16 border-4 border-t-blue-400 border-gray-700 rounded-full animate-spin"></div>
                </div>
            )}
            <MapContainer center={coords.pickup} zoom={13} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={coords.pickup} icon={startIcon} />
                <Marker position={coords.destination} icon={endIcon} />

                {route.length > 0 && (
                    <>
                        <Polyline positions={route} color="blue" weight={6} opacity={0.8} />
                        <FitBounds route={route} />
                    </>
                )}
            </MapContainer>
        </div>
    );
}

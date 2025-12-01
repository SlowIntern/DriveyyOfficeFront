"use client";


import L from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Polyline, TileLayer, useMap } from "react-leaflet";

// Custom marker icon
const icon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9/dist/images/marker-shadow.png",
});

// Component to auto-fit map bounds to the route
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

interface ORSMapProps {
    pickup: [number, number];      // [lat, lng]
    destination: [number, number]; // [lat, lng]
}

export default function ORSMap({ pickup, destination }: ORSMapProps) {
    const [route, setRoute] = useState<[number, number][]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!pickup || !destination) return;

        const fetchRoute = async () => {
            setLoading(true);
            try {
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
                                [pickup[1], pickup[0]],        // lon, lat
                                [destination[1], destination[0]] // lon, lat
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

                // Convert ORS coordinates [lon, lat] → [lat, lon] for Leaflet
                const coords: [number, number][] = data.features[0].geometry.coordinates.map(
                    (c: any) => [Number(c[1]), Number(c[0])]
                );

                setRoute(coords);
            } catch (err) {
                console.error("Error fetching ORS route:", err);
                setRoute([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRoute();
    }, [pickup, destination]);

    return (
        <div className="w-full h-[400px] rounded-xl overflow-hidden border border-gray-700 relative">
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 z-10">
                    <div className="w-16 h-16 border-4 border-t-blue-400 border-gray-700 rounded-full animate-spin"></div>
                </div>
            )}

            <MapContainer
                center={pickup}
                zoom={13}
                scrollWheelZoom
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {/* Markers */}
                <Marker position={pickup} icon={icon} />
                <Marker position={destination} icon={icon} />

                {/* Polyline */}
                {route.length > 0 && (
                    <>
                        <Polyline positions={route} weight={6} color="blue" />
                        <FitBounds route={route} />
                    </>
                )}
            </MapContainer>
        </div>
    );
}

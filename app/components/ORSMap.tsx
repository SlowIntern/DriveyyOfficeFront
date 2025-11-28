"use client";

import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";

const icon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9/dist/images/marker-shadow.png",
});

function FitBounds({ route }: { route: any[] }) {
    const map = useMap();

    useEffect(() => {
        if (route.length > 0) {
            const bounds = L.latLngBounds(route);
            map.fitBounds(bounds, { padding: [40, 40] });
        }
    }, [route]);

    return null;
}

export default function ORSMap({ pickup, destination }: any) {
    const [route, setRoute] = useState<any[]>([]);

    useEffect(() => {
        if (!pickup || !destination) return;

        const fetchRoute = async () => {
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
                            [destination[1], destination[0]]
                        ],
                    }),
                }
            );

            const data = await response.json();
            console.log("ORS:", data);

            if (!data.features || !data.features[0]) return;

            const coords = data.features[0].geometry.coordinates.map(
                (c: any) => [c[1], c[0]]  // convert lon,lat → lat,lon
            );

            setRoute(coords);
        };

        fetchRoute();
    }, [pickup, destination]);

    return (
        <div className="w-full h-[400px] rounded-xl overflow-hidden border border-gray-700">
            <MapContainer
                center={pickup}
                zoom={13}
                scrollWheelZoom
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                <Marker position={pickup} icon={icon} />
                <Marker position={destination} icon={icon} />

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

"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function MapPolygon() {
    const mapRef = useRef<L.Map | null>(null);
    const polygonRef = useRef<L.Polygon | null>(null);
    const latlngsRef = useRef<L.LatLng[]>([]);

    useEffect(() => {
        if (mapRef.current) return;

        const map = L.map("map").setView([20.5937, 78.9629], 6);
        mapRef.current = map;

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap",
        }).addTo(map);

        map.on("click", (e: L.LeafletMouseEvent) => {
            latlngsRef.current.push(e.latlng);

            //
            if (polygonRef.current) {
                polygonRef.current.remove();
            }

            // Draw new polygon
            polygonRef.current = L.polygon(latlngsRef.current, {
                color: "red",
                fillOpacity: 0.3,
            }).addTo(map);

            // Log coordinates
            const coords = latlngsRef.current.map((p) => ({
                lat: p.lat,
                lng: p.lng,
            }));
            console.log("Polygon Coordinates:", coords);
        });
    }, []);

    return <div id="map" style={{ height: "500px", width: "100%" }}></div>;
}

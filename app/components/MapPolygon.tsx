"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import api from "../lib/api";

export default function MapPolygon() {
    const mapRef = useRef<L.Map | null>(null);
    const polygonRef = useRef<L.Polygon | null>(null);
    const latlngsRef = useRef<L.LatLng[]>([]);
    const savedLayerRef = useRef<L.FeatureGroup | null>(null);

    const [areaName, setAreaName] = useState("");
    const [saving, setSaving] = useState(false);

    /* ------------------ INIT MAP ------------------ */
    useEffect(() => {
        if (mapRef.current) return;

        const map = L.map("map").setView([20.5937, 78.9629], 6);
        mapRef.current = map;

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap",
        }).addTo(map);

        savedLayerRef.current = L.featureGroup().addTo(map);

        map.on("click", (e: L.LeafletMouseEvent) => {
            latlngsRef.current.push(e.latlng);

            polygonRef.current?.remove();

            polygonRef.current = L.polygon(latlngsRef.current, {
                color: "#e11d48",
                fillOpacity: 0.35,
            }).addTo(map);
        });
    }, []);

    useEffect(() => {
        if (!mapRef.current || !savedLayerRef.current) return;

        api.get("/service-area").then((res) => {
            savedLayerRef.current!.clearLayers();

            res.data.forEach((area: any) => {
                const latLngs = area.coordinates.map((c: any) => [
                    c.lat,
                    c.lng,
                ]);

                L.polygon(latLngs, {
                    color: "#2563eb",
                    fillOpacity: 0.2,
                }).addTo(savedLayerRef.current!);
            });
        });
    }, []);

    /* ------------------ SAVE POLYGON ------------------ */
    const savePolygon = async () => {
        if (!areaName.trim()) {
            alert("Please enter service area name");
            return;
        }

        if (latlngsRef.current.length < 3) {
            alert("Polygon must have at least 3 points");
            return;
        }

        setSaving(true);

        const payload = {
            name: areaName,
            coordinates: latlngsRef.current.map((p) => ({
                lat: p.lat,
                lng: p.lng,
            })),
            isActive: true,
        };

        try {
            await api.post("/service-area/area", payload);

            // Reset
            setAreaName("");
            latlngsRef.current = [];
            polygonRef.current?.remove();
            polygonRef.current = null;

            // Reload saved areas
            const res = await api.get("/service-area");
            savedLayerRef.current!.clearLayers();

            res.data.forEach((area: any) => {
                const latLngs = area.coordinates.map((c: any) => [
                    c.lat,
                    c.lng,
                ]);

                L.polygon(latLngs, {
                    color: "#2563eb",
                    fillOpacity: 0.2,
                }).addTo(savedLayerRef.current!);
            });
        } catch (err) {
            console.error("Failed to save service area", err);
            alert("Failed to save service area");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "16px" }}>
            {/* MAP */}
            <div
                id="map"
                style={{
                    height: "520px",
                    width: "100%",
                    borderRadius: "10px",
                    border: "1px solid #e5e7eb",
                }}
            />

            {/* CONTROL PANEL */}
            <div
                style={{
                    padding: "16px",
                    borderRadius: "10px",
                    border: "1px solid #e5e7eb",
                    background: "#ffffff",
                }}
            >
                <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "12px" }}>
                    Create Service Area
                </h3>

                <label style={{ fontSize: "14px", color: "#374151" }}>
                    Service Area Name
                </label>

                <input
                    type="text"
                    value={areaName}
                    onChange={(e) => setAreaName(e.target.value)}
                    placeholder="e.g. South Delhi Zone"
                    style={{
                        width: "100%",
                        marginTop: "6px",
                        marginBottom: "14px",
                        padding: "8px 10px",
                        borderRadius: "6px",
                        border: "1px solid #d1d5db",
                        outline: "none",
                    }}
                />

                <button
                    onClick={savePolygon}
                    disabled={saving}
                    style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "none",
                        background: saving ? "#9ca3af" : "#2563eb",
                        color: "#fff",
                        cursor: saving ? "not-allowed" : "pointer",
                        fontWeight: 500,
                    }}
                >
                    {saving ? "Saving..." : "Save Service Area"}
                </button>

                <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "10px" }}>
                    Click on the map to draw polygon (minimum 3 points)
                </p>
            </div>
        </div>
    );
}

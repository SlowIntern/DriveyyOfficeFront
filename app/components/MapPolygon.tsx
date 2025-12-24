"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import api from "../lib/api";

export default function MapPolygon() {
    const mapRef = useRef<L.Map | null>(null);

    const polylineRef = useRef<L.Polyline | null>(null);
    const polygonRef = useRef<L.Polygon | null>(null);
    const latlngsRef = useRef<L.LatLng[]>([]);

    const savedLayerRef = useRef<L.FeatureGroup | null>(null);
    const savedPolygonsRef = useRef<L.Polygon[]>([]);

    const [areaName, setAreaName] = useState("");
    const [saving, setSaving] = useState(false);

    /* ---------------- INIT MAP ---------------- */
    useEffect(() => {
        if (mapRef.current) return;
    
        const map = L.map("map", {
            doubleClickZoom: false,
        }).setView([20.5937, 78.9629], 6);

        mapRef.current = map;

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap",
        }).addTo(map);

        savedLayerRef.current = L.featureGroup().addTo(map);

        map.on("click", (e) => {
            const point = e.latlng;

            //  BLOCK drawing inside ANY saved polygon
            const blocked = savedPolygonsRef.current.some((poly) =>
                poly.getBounds().contains(point)
            );

            if (blocked) {
                alert("Cannot draw inside an existing service area");
                return;
            }

            latlngsRef.current.push(point);

            // Preview polyline
            if (!polylineRef.current) {
                polylineRef.current = L.polyline(latlngsRef.current, {
                    color: "#e11d48",
                    weight: 2,
                }).addTo(map);
            } else {
                polylineRef.current.setLatLngs(latlngsRef.current);
            }

            // Polygon after 3 points
            if (latlngsRef.current.length >= 3) {
                polygonRef.current?.remove();
                polygonRef.current = L.polygon(latlngsRef.current, {
                    color: "#e11d48",
                    fillOpacity: 0.35,
                }).addTo(map);
            }
        });

        // Finish drawing
        map.on("dblclick", () => {
            polylineRef.current?.remove();
            polylineRef.current = null;
            latlngsRef.current = [];
        });
    }, []);

    /* ------------ LOAD SAVED AREAS ------------ */
    useEffect(() => {
        if (!mapRef.current || !savedLayerRef.current) return;

        api.get("/service-area").then((res) => {
            savedLayerRef.current!.clearLayers();
            savedPolygonsRef.current = [];

            res.data.forEach((area: any) => {
                const latlngs = area.coordinates.map((c: any) =>
                    L.latLng(c.lat, c.lng)
                );

                const polygon = L.polygon(latlngs, {
                    color: "#2563eb",
                    fillOpacity: 0.2,
                }).addTo(savedLayerRef.current!);

                savedPolygonsRef.current.push(polygon);
            });
        });
    }, []);

    /* ------------ SAVE POLYGON ------------ */
    const savePolygon = async () => {
        if (!areaName.trim()) {
            alert("Please enter service area name");
            return;
        }

        if (latlngsRef.current.length < 3) {
            alert("Minimum 3 points required");
            return;
        }

        setSaving(true);

        try {
            await api.post("/service-area/area", {
                name: areaName,
                coordinates: latlngsRef.current.map((p) => ({
                    lat: p.lat,
                    lng: p.lng,
                })),
                isActive: true,
            });

            // Reset drawing 
            setAreaName("");
            latlngsRef.current = [];

            polygonRef.current?.remove();
            polylineRef.current?.remove();

            polygonRef.current = null;
            polylineRef.current = null;

            // Reload
            const res = await api.get("/service-area");
            savedLayerRef.current!.clearLayers();
            savedPolygonsRef.current = [];

            res.data.forEach((area: any) => {
                const latlngs = area.coordinates.map((c: any) =>
                    L.latLng(c.lat, c.lng)
                );

                const poly = L.polygon(latlngs, {
                    color: "#2563eb",
                    fillOpacity: 0.2,
                }).addTo(savedLayerRef.current!);

                savedPolygonsRef.current.push(poly);
            });
        } catch (e) {
            alert("Failed to save service area");
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}>
            <div
                id="map"
                style={{
                    height: 520,
                    borderRadius: 10,
                    border: "1px solid #e5e7eb",
                }}
            />

            <div style={{ padding: 16, border: "1px solid #e5e7eb", borderRadius: 10 }}>
                <h3>Create Service Area</h3>

                <input
                    value={areaName}
                    onChange={(e) => setAreaName(e.target.value)}
                    placeholder="Area name"
                    style={{ width: "100%", marginBottom: 12 }}
                />

                <button onClick={savePolygon} disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                </button>

                <p style={{ fontSize: 12, marginTop: 8 }}>
                    Click to draw • Double-click to finish
                </p>
            </div>
        </div>
    );
}

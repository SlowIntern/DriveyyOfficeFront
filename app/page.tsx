import dynamic from "next/dynamic";
import UberCloneHomepage from "./home/page";

// Dynamic import for Leaflet map (client-side only)
const MapPolygon = dynamic(() => import("./components/MapPolygon"), {
  ssr: true,
});

export default function Home() {
  return (
    <div>
      {/* Render your homepage content */}
      <UberCloneHomepage />

      {/* Render the Leaflet polygon map */}
      <div style={{ height: "500px", marginTop: "20px" }}>
        <MapPolygon />
      </div>
    </div>
  );
}





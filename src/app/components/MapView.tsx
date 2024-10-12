// components/MapView.tsx
"use client";

import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface MapViewProps {
  positions: [number, number][];
}

export default function MapView({ positions }: MapViewProps) {
  const center: [number, number] =
    positions.length > 0
      ? positions[positions.length - 1]
      : [35.6895, 139.6917]; // デフォルトは東京

  return (
    <MapContainer
      center={center}
      zoom={15}
      style={{ height: "400px", width: "100%" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {positions.length > 0 && (
        <>
          <Polyline positions={positions} color="blue" />
          <Marker position={positions[positions.length - 1]} />
        </>
      )}
    </MapContainer>
  );
}

// アイコンの設定
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

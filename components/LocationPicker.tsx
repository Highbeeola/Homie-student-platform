"use client";
import React, { useEffect, useState } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapPin, Navigation } from "lucide-react";

// Fix for default Leaflet markers in Next.js
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Component to handle map clicks
function MapEvents({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Component to update map view when coordinates change
function MapUpdater({ coords }: { coords: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(coords, map.getZoom());
  }, [coords, map]);
  return null;
}

type Props = {
  latitude?: number;
  longitude?: number;
  onLocationChange: (lat: number, lng: number) => void;
};

function LocationPicker({ latitude, longitude, onLocationChange }: Props) {
  const defaultCenter: [number, number] = [6.5244, 3.3792];
  const position: [number, number] =
    latitude && longitude ? [latitude, longitude] : defaultCenter;
  const [isLocating, setIsLocating] = useState(false);

  const handleCurrentLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          onLocationChange(pos.coords.latitude, pos.coords.longitude);
          setIsLocating(false);
        },
        (err) => {
          alert("Could not get location.");
          setIsLocating(false);
        },
      );
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-[#bcdff0]">
          Pin Location on Map
        </label>
        <button
          type="button"
          onClick={handleCurrentLocation}
          className="flex items-center gap-1 text-xs text-[#00d4ff] hover:underline"
        >
          {isLocating ? (
            "Locating..."
          ) : (
            <>
              <Navigation size={12} /> Use My Location
            </>
          )}
        </button>
      </div>

      <div className="h-[300px] w-full overflow-hidden rounded-xl border border-white/20 relative z-0">
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position} icon={icon} />
          <MapEvents onLocationSelect={onLocationChange} />
          <MapUpdater coords={position} />
        </MapContainer>
      </div>
    </div>
  );
}

// 2. Export it wrapped in React.memo
// This prevents re-renders when parent text inputs change
export default React.memo(LocationPicker);

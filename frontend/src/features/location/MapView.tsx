import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useEffect } from "react";
import type { Coords } from "@/types";
import { MapContainer } from "react-leaflet/MapContainer";
import { Marker } from "react-leaflet/Marker";
import { Popup } from "react-leaflet/Popup";
import { TileLayer } from "react-leaflet/TileLayer";
import { useMap } from "react-leaflet/hooks";

const defaultIcon = L.icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

function Recenter({ coords }: { coords: Coords }) {
    const map = useMap();
    useEffect(() => {
        map.setView([coords.lat, coords.lon]);
    }, [coords.lat, coords.lon, map]);
    return null;
}

export function MapView({ coords }: { coords: Coords }) {
    return (
        <div className="relative isolate z-0">
            <MapContainer
                center={[coords.lat, coords.lon]}
                zoom={16}
                scrollWheelZoom={false}
                className="h-[70dvh] w-full rounded-3xl"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Recenter coords={coords} />
                <Marker position={[coords.lat, coords.lon]} icon={defaultIcon}>
                    <Popup>
                        You are here: {coords.lat.toFixed(4)}, {coords.lon.toFixed(4)}
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}
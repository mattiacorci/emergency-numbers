import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { Coords } from "@/types";
import { MapContainer } from "react-leaflet/MapContainer";
import { Marker } from "react-leaflet/Marker";
import { Popup } from "react-leaflet/Popup";
import { TileLayer } from "react-leaflet/TileLayer";
import { useMap } from "react-leaflet/hooks";
import { Circle } from "react-leaflet/Circle";

const radarIcon = L.divIcon({
    className: "radar-marker",
    html: '<span class="radar-halo"></span><span class="radar-dot"></span>',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -16],
});

function Recenter({ coords }: { coords: Coords }) {
    const map = useMap();

    useEffect(() => {
        map.setView([coords.lat, coords.lon]);
    }, [coords.lat, coords.lon, map]);

    return null;
}

export function MapView({ coords }: { coords: Coords }) {
    const { t } = useTranslation();

    return (
        <div className="relative isolate z-0" role="region" aria-label={t('location.mapLabel')}>
            <MapContainer
                center={[coords.lat, coords.lon]}
                zoom={16}
                scrollWheelZoom={false}
                className="h-[70dvh] w-full rounded-3xl"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png?key=cb1_3qi1_1_9bf1f5b0ce8fa57be0e089e0"
                    subdomains="abcd"
                    maxZoom={20}
                />
                <Recenter coords={coords} />
                <Marker position={[coords.lat, coords.lon]} icon={radarIcon}>
                    <Popup>
                        {t('location.youAreHere')}: {coords.lat.toFixed(4)}, {coords.lon.toFixed(4)}
                    </Popup>
                </Marker>
                <Circle
                    center={[coords.lat, coords.lon]}
                    radius={coords.accuracy}
                    pathOptions={{ color: "#3061a3", weight: 1, fillOpacity: 0.16 }}
                />
            </MapContainer>
        </div>
    );
}
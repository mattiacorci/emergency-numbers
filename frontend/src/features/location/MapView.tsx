

import type { Coords } from "@/types";
import { MapContainer } from "react-leaflet/MapContainer";
import { Marker } from "react-leaflet/Marker";
import { Popup } from "react-leaflet/Popup";
import { TileLayer } from "react-leaflet/TileLayer";
// Props: { coords: Coords }
// MapContainer di React Leaflet centrato su coords
// Marker sulla posizione
// Dimensione fissa o fluid via className
// Importa leaflet/dist/leaflet.css

export function MapView({ coords }: { coords: Coords }) {
    return (
        <div>
            {coords && (
                <MapContainer center={[coords.lat, coords.lon]} zoom={15} scrollWheelZoom={false} style={{ width: '400px', height: '400px' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[coords.lat, coords.lon]}>
                        <Popup>
                            A pretty CSS3 popup. <br /> Easily customizable.
                        </Popup>
                    </Marker>
                </MapContainer>
            )}
        </div>
    )
}
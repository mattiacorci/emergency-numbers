import { useState } from 'react'
import './App.css'
import 'leaflet/dist/leaflet.css'
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'


type LocationData = {
  display_name?: string
  address: {
    'ISO3166-2-lv14'?: string,
    'ISO3166-2-lv16'?: string,
    city?: string,
    country?: string,
    country_code?: string,
    house_number?: string,
    postcode?: string,
    road?: string,
    state: string,
    village?: string
  },
  lat: number,
  lon: number,
  boundingbox: [number, number, number, number]
}

function App() {
  const [count, setCount] = useState(0)
  const [location, setLocation] = useState<LocationData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)


  const getLocation = () => {
    setIsLoading(true);
    setError(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          console.log("Latitude:", position.coords.latitude);
          console.log("Longitude:", position.coords.longitude);

          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`, { headers: { 'Accept-language': 'en-US' } }
          );

          const data = await res.json();
          console.log("Location:", data);
          setLocation(data);
          setIsLoading(false);
        },
        (error) => {
          console.error("Error Code:", error.code, " - ", error.message);
          setError("Failed to get location.");
          setIsLoading(false);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }

  return (
    <div>
      <Button size="lg" onClick={getLocation} disabled={isLoading}>
        {isLoading ? "Getting Location..." : "Get Location"}
      </Button>

      {error && <p className="text-red-500">{error}</p>}

      {location && (
        <div style={{ marginTop: 16 }}>
          <p><strong>Country:</strong> {location.display_name}</p>
          <p><strong>State:</strong> {location.address.state}</p>
          <p><strong>City:</strong> {location.address.city}</p>
          <p><strong>Lat:</strong> {location.lat}</p>
          <p><strong>Lon:</strong> {location.lon}</p>
        </div>
      )}

      { location && (
        <div>
          <MapContainer center={[location.lat, location.lon]} zoom={15} scrollWheelZoom={false} style={{ width: '400px', height: '400px' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[location.lat, location.lon]}>
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          </MapContainer>
          </div>
      )}
    </div>
  )
}

export default App

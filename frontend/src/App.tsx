// Wrappa tutto con LocationProvider
// Renderizza HomePage
// Qui importi leaflet/dist/leaflet.css se non lo fai in MapView

import { useEffect, useState } from 'react'
import './App.css'
import 'leaflet/dist/leaflet.css'
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import { useGeolocation } from './features/location/useGeolocation'
import { useReverseGeocode } from './features/location/useReverseGeocode'
import { MapView } from './features/location/MapView'
import { HomePage } from './pages/HomePage'


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
  return (
    <div>
      <HomePage />
    </div>
  )
}

export default App

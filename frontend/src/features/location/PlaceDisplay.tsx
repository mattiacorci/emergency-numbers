// Props: { coords: Coords }
// Mostra lat, lng, accuracy formattati (es. 4 decimali)
// Usa Card di shadcn

import type { Coords, NominatimResponse } from "@/types";

export function PlaceDisplay({ coords, place }: { coords: Coords; place: NominatimResponse | null }) {

    console.log("PlaceDisplay coords:", coords); // Log the coords for debugging
    console.log("PlaceDisplay place:", place); // Log the place for debugging
  return (
    <div>
     {coords && (
        <div className="p-8 border rounded shadow">
          <p><strong>Latitude:</strong> {coords?.lat.toFixed(4)}</p>
          <p><strong>Longitude:</strong> {coords?.lon.toFixed(4)}</p>
          <p><strong>Accuracy:</strong> {coords?.accuracy} meters</p>
          <p><strong>Address:</strong> {place?.display_name}</p>
          <p><strong>ISO 3166-2:</strong> {place?.address["ISO3166-2-lvl6"]}</p>
        </div>
      )}
    </div>

  )
}



 
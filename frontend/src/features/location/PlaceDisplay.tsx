// Props: { coords: Coords }
// Mostra lat, lng, accuracy formattati (es. 4 decimali)
//
import type { Coords, NominatimResponse } from "@/types";

export function PlaceDisplay({ coords, place }: { coords: Coords; place: NominatimResponse | null }) {

  return (
    <div>
      {coords && (
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl/normal font-medium">You are in {place?.display_name}</h2>
          <div className="text-xl font-medium text-neutral-600">
            Latitude: {coords?.lat.toFixed(4)}<br />
            Longitude: {coords?.lon.toFixed(4)}<br />
            Accuracy: {coords?.accuracy} meters
          </div>
        </div>
      )}
    </div>

  )
}




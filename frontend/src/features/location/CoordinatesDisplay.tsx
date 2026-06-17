// Props: { coords: Coords }
// Mostra lat, lng, accuracy formattati (es. 4 decimali)
// Usa Card di shadcn

import type { Coords } from "@/types";

export function CoordinatesDisplay({ coords }: { coords: Coords }) {

    console.log("CoordinatesDisplay coords:", coords); // Log the coords for debugging
  return (
    <div>
     {coords && (
    <div className="p-4 border rounded shadow">
      <p><strong>Latitude:</strong> {coords?.lat.toFixed(4)}</p>
      <p><strong>Longitude:</strong> {coords?.lon.toFixed(4)}</p>
      <p><strong>Accuracy:</strong> {coords?.accuracy} meters</p>
    </div>
      )}
    </div>

  )
}



 
import type { Coords, NominatimResponse } from "@/types";
import { useEffect, useState } from "react";

export function useReverseGeocode(coords: Coords | null) {
    const [place, setPlace] = useState<NominatimResponse | null>(null);

    useEffect(() => {
        if (!coords) {
            setPlace(null);
            return;
        }

    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${coords.lat}&lon=${coords.lon}&format=json`)
      .then(res => res.json())
      .then(data => setPlace(data))
      .catch(err => {
        console.error("Error fetching reverse geocode data:", err);
        setPlace(null);
      });

    }, [coords]);

    return place;
}

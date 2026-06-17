// Layout principale della pagina
// Assembla nell'ordine:
//   StatusBanner (stato geoloc)
//   CoordinatesDisplay
//   MapView
//   EmergencyNumbers
// Non contiene logica propria, solo struttura e spacing

import { CoordinatesDisplay } from "@/features/location/CoordinatesDisplay";
import { MapView } from "@/features/location/MapView";
import { useGeolocation } from "@/features/location/useGeolocation";
import { useReverseGeocode } from "@/features/location/useReverseGeocode";
import { Button } from "@/components/ui/button"
import { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";

export function HomePage() {
    const { coords, status, error, start } = useGeolocation();
    const place = useReverseGeocode(coords);

    useEffect(() => {
        console.log(place)
    }, [place]);

    return (
        <div>
            {/* <StatusBanner /> */}

            {status === 'idle' && (
            <Button size="lg" onClick={start} disabled={status === 'loading'}>
                {status === 'loading' ? "Getting Location..." : "Get Location"}
            </Button>
            )}

            {status === 'loading' && (
            <Button size="lg" disabled>
                <Spinner data-icon="inline-start" />
                Getting location...
            </Button>
            )}

            {status === 'success' && (
                <>
                <CoordinatesDisplay coords={coords} />
                <MapView coords={coords} />
                </>
            )}

            {/* <EmergencyNumbers /> */}
        </div>
    )
}
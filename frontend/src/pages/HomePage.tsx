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
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { ArrowUpRightIcon } from "lucide-react";
import { IconCompass, IconFolderCode } from "@tabler/icons-react"


export function HomePage() {
    const { coords, status, error, start } = useGeolocation();
    const place = useReverseGeocode(coords);

    useEffect(() => {
        console.log(place)
    }, [place]);

    return (
        <div>
            {/* <StatusBanner /> */}

            {(status === 'idle' || status === 'loading') && (
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <IconCompass size={48} />
                        </EmptyMedia>
                        <EmptyTitle>No position yet</EmptyTitle>
                        <EmptyDescription>
                            In order to get information about your current position, you need to allow the browser to access your location.
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent className="flex-row justify-center gap-2">
                        {status === 'idle' && (
                            <Button size="lg" onClick={start}>
                                Get Current Location
                            </Button>
                        )}

                        {status === 'loading' && (
                            <Button size="lg" disabled>
                                <Spinner data-icon="inline-start" />
                                Getting location...
                            </Button>
                        )}
                    </EmptyContent>
                </Empty>

            )}


            {status === 'success' && coords && (
                <>
                    <CoordinatesDisplay coords={coords} />
                    <MapView coords={coords} />
                </>
            )}

            {/* <EmergencyNumbers /> */}
        </div>
    )
}
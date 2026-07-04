// Layout principale della pagina
// Assembla nell'ordine:
//   StatusBanner (stato geoloc)
//   CoordinatesDisplay
//   MapView
//   EmergencyNumbers
// Non contiene logica propria, solo struttura e spacing

import { PlaceDisplay } from "@/features/location/PlaceDisplay";
import { MapView } from "@/features/location/MapView";
import { useGeolocation } from "@/features/location/useGeolocation";
import { useReverseGeocode } from "@/features/location/useReverseGeocode";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { EmergencyNumbers } from "@/features/emergency/EmergencyNumbers";


export function HomePage() {
    const { coords, status, start, reset } = useGeolocation();
    const place = useReverseGeocode(coords);

    const countryCode = place?.address?.["ISO3166-2-lvl6"] || place?.address?.["ISO3166-2-lvl4"];

    return (
        <div>
            {/* <StatusBanner /> */}

            {(status === 'idle' || status === 'loading') && (
                <Empty>
                    <EmptyHeader>
                        <EmptyTitle>Start by taking a deep breath</EmptyTitle>
                        <EmptyDescription>
                            Now, let me see your location.
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent className="flex-row justify-center gap-2">
                        {status === 'idle' && (
                            <Button size="lg" onClick={start} className="w-full">
                                Get Current Location
                            </Button>
                        )}
                        {status === 'loading' && (
                            <Button size="lg" disabled className="w-full">
                                <Spinner data-icon="inline-start" />
                                Getting Current Location...
                            </Button>
                        )}
                    </EmptyContent>
                </Empty>

            )}

            {status === 'error' && (
                <Empty>
                    <EmptyHeader>
                        <EmptyTitle>Location not active</EmptyTitle>
                        <EmptyDescription>
                            You need to let me see where you are, otherwise I won't be able to give you the information.
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent className="flex-row justify-center gap-2">
                        <Button size="lg" onClick={reset} className="w-full">
                            Try Again
                        </Button>
                    </EmptyContent>
                </Empty>
            )}

            {status === 'success' && coords && (
                <div className="flex w-full min-w-0 flex-1 flex-col gap-8">
                    <h1 className="text-5xl/normal lg:text-6xl/normal font-medium">Ok, found you</h1>
                    <div className="flex flex-col lg:flex-row gap-12">
                        <div className="w-full lg:w-1/2 rounded-3xl">
                            <MapView coords={coords} />
                        </div>
                        <div className="w-full lg:w-1/2 flex flex-col gap-8">
                            <PlaceDisplay coords={coords} place={place} />
                            {countryCode && (
                                <EmergencyNumbers countryCode={countryCode} />
                            )}
                        </div>
                    </div>
                </div>
            )}
            {/* <EmergencyNumbers /> */}
        </div>
    )
}
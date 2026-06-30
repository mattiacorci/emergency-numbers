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
import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { EmergencyNumbers } from "@/features/emergency/EmergencyNumbers";


export function HomePage() {
    const { coords, status, start } = useGeolocation();
    const place = useReverseGeocode(coords);

    const countryCode = place?.address?.["ISO3166-2-lvl6"];

    return (
        <div>
            {/* <StatusBanner /> */}

            {(status === 'idle') && (
                <Empty>
                    <EmptyHeader>
                        <EmptyTitle>Start by taking a deep breath</EmptyTitle>
                        <EmptyDescription>
                            Now, let me see your location.
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent className="flex-row justify-center gap-2">
                        <Button size="lg" onClick={start} className="w-full">
                            Get Current Location
                        </Button>
                    </EmptyContent>
                </Empty>

            )}

            {status === 'loading' && (
                <div className="flex w-full min-w-0 flex-1 flex-col gap-8">
                    <h1 className="text-5xl/normal lg:text-6xl/normal font-medium">Looking for you...</h1>
                    <div className="flex flex-col lg:flex-row gap-12">
                        <div className="w-full lg:w-1/2">
                            <div className="w-full aspect-square bg-neutral-200 rounded-3xl flex items-center justify-center">
                                <div className="w-8 h-8 border-4 border-neutral-300 border-t-neutral-500 rounded-full animate-spin-map"></div>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <h2 className="text-3xl/normal font-medium">Wait a few seconds...</h2>
                        </div>
                    </div>
                </div>
            )}

            {status === 'success' && coords && (
                <div className="flex w-full min-w-0 flex-1 flex-col gap-8">
                    <h1 className="text-5xl/normal lg:text-6xl/normal font-medium">Ok, found you</h1>
                    <div className="flex flex-col lg:flex-row gap-12">
                        <div className="w-full lg:w-1/2 rounded-3xl">
                            <MapView coords={coords} />
                        </div>
                        <div className="w-full lg:w-1/2">
                            <h2 className="text-3xl/normal font-medium">Wait a few seconds...</h2>
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
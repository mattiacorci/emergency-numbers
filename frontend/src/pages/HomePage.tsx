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
// import { useTranslation } from "react-i18next";


export function HomePage() {

    // const { t, i18n } = useTranslation();

    const { coords, status, start, reset } = useGeolocation();
    const place = useReverseGeocode(coords);

    const countryCode = place?.address?.["ISO3166-2-lvl6"] || place?.address?.["ISO3166-2-lvl4"];

    return (
        <div className="max-w-2xl mx-auto flex flex-col gap-8 py-4">
            {/* {t("foo")} */}

            {(status === 'idle' || status === 'loading') && (
                <div className="flex flex-col gap-12">
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
                    <div className="flex flex-col gap-4">
                        <p className="text-sm text-neutral-600">By clicking the button, you will be asked to share your location. We will only use this information to provide you with relevant emergency information.</p>
                        <p className="text-sm text-neutral-600">This app is a personal project and the author of this app declines any responsibility for the accuracy of the information provided and any reliance on such information.</p>
                        <p className="text-sm font-semibold text-neutral-600">Be aware that if you call an emergency number without a valid reason, you may be charged by the authority.</p>
                    </div>
                    {/* <Button onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'it' : 'en')}>
                        {t("common.changeLanguage")}
                    </Button> */}
                </div>


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
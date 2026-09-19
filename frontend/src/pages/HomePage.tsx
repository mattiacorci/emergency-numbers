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
import { useBackendStatus } from "@/hooks/useBackendStatus";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

export function HomePage() {

    const { coords, status, start, reset } = useGeolocation();
    const place = useReverseGeocode(coords);
    const serverStatus = useBackendStatus();

    const { t } = useTranslation();

    const countryCode = place?.address?.["ISO3166-2-lvl6"] || place?.address?.["ISO3166-2-lvl4"];

    return (
        <>
            {(serverStatus == 'checking' || serverStatus == 'waking') && (
                <div role="status" aria-live="polite" aria-atomic="true">
                    <Empty>
                        <EmptyHeader>
                            <EmptyTitle as="h1">{t('home.serverWaking')}</EmptyTitle>
                        </EmptyHeader>
                        <EmptyDescription>
                            {t('home.waitASecond')}
                        </EmptyDescription>
                    </Empty>
                </div>
            )}
            {serverStatus == 'unreachable' && (
                <div role="status" aria-live="polite" aria-atomic="true">
                    <Empty>
                        <EmptyHeader>
                            <EmptyTitle as="h1">{t('home.serverUnavailableTitle')}</EmptyTitle>
                            <EmptyDescription>
                                {t('home.serverUnavailableMessage')}
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                </div>
            )}

            {(serverStatus == 'ready' && (status == 'idle' || status === 'loading')) && (
                <div className="max-w-2xl mx-auto flex flex-col gap-8 py-4">
                    <div className="flex flex-col gap-12">
                        <Empty>
                            <EmptyHeader>
                                <EmptyTitle as="h1">{t('home.startBreath')}</EmptyTitle>
                                <EmptyDescription>
                                    {t('home.locationPrompt')}
                                </EmptyDescription>
                            </EmptyHeader>
                            <EmptyContent className="flex-row justify-center gap-2">
                                {status === 'idle' && (
                                    <Button size="lg" onClick={start} className="w-full">
                                        {t('home.getLocation')}
                                    </Button>
                                )}
                                {status === 'loading' && (
                                    <Button size="lg" disabled className="w-full">
                                        <Spinner aria-label={t('home.gettingLocation')} data-icon="inline-start" />
                                        {t('home.gettingLocation')}
                                    </Button>
                                )}
                            </EmptyContent>
                        </Empty>
                        <div className="flex flex-col gap-4">
                            <p className="text-sm text-neutral-600">{t('home.disclaimerLocation')}</p>
                            <p className="text-sm text-neutral-600">{t('home.disclaimerProject')}</p>
                            <p className="text-sm font-semibold text-neutral-600">{t('home.disclaimerWarning')}</p>
                        </div>
                    </div>
                </div>


            )}

            {serverStatus == 'ready' && status === 'error' && (
                <div className="max-w-2xl mx-auto flex flex-col gap-8 py-4">
                    <Empty>
                        <EmptyHeader>
                            <EmptyTitle as="h1">{t('home.locationNotActive')}</EmptyTitle>
                            <EmptyDescription>
                                {t('home.locationNotActiveDescription')}
                            </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent className="flex-row justify-center gap-2">
                            <Button size="lg" onClick={reset} className="w-full">
                                {t('common.tryAgain')}
                            </Button>
                        </EmptyContent>
                    </Empty>
                </div>
            )}

            {serverStatus == 'ready' && status === 'success' && coords && (
                <div className="max-w-6xl mx-auto flex flex-col gap-8 py-4">
                    <div className="flex w-full min-w-0 flex-1 flex-col gap-8">
                        <h1 className="text-5xl/normal lg:text-6xl/normal font-medium">{t('home.foundYou')}</h1>
                        <div className="flex flex-col lg:flex-row gap-12">
                            <div className="w-full lg:w-2/3 rounded-3xl">
                                <MapView coords={coords} />
                            </div>
                            <div className="w-full lg:w-1/3 flex flex-col gap-8">
                                <PlaceDisplay coords={coords} place={place} />
                                {countryCode && (
                                    <EmergencyNumbers countryCode={countryCode} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex justify-center">
                <LanguageSwitcher></LanguageSwitcher>
            </div>
        </>
    )
}
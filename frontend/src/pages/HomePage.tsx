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
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { afterTitle, fadeUp, fadeUpSlow, mainSequence, stagger } from "@/lib/motion";

export function HomePage() {

    const { coords, status, start, reset } = useGeolocation();
    const place = useReverseGeocode(coords);
    const serverStatus = useBackendStatus();

    const { t } = useTranslation();
    const shouldReduceMotion = useReducedMotion() ?? false;

    const countryCode = place?.address?.["ISO3166-2-lvl6"] || place?.address?.["ISO3166-2-lvl4"];

    return (
        <>
            <AnimatePresence mode="wait">
                {serverStatus === 'waking' && (
                    <motion.div
                        key="waking"
                        role="status"
                        aria-live="polite"
                        aria-atomic="true"
                        initial={shouldReduceMotion ? false : "hidden"}
                        animate="visible"
                        exit={shouldReduceMotion ? undefined : "hidden"}
                        variants={fadeUp}
                    >
                        <Empty>
                            <EmptyHeader>
                                <EmptyTitle as="h1">{t('home.serverWaking')}</EmptyTitle>
                            </EmptyHeader>
                            <EmptyDescription>{t('home.waitASecond')}</EmptyDescription>
                        </Empty>
                    </motion.div>
                )}
                {serverStatus === 'unreachable' && (
                    <motion.div
                        key="unreachable"
                        role="status"
                        aria-live="polite"
                        aria-atomic="true"
                        initial={shouldReduceMotion ? false : "hidden"}
                        animate="visible"
                        variants={fadeUp}
                    >
                        <Empty>
                            <EmptyHeader>
                                <EmptyTitle as="h1">{t('home.serverUnavailableTitle')}</EmptyTitle>
                                <EmptyDescription>{t('home.serverUnavailableMessage')}</EmptyDescription>
                            </EmptyHeader>
                        </Empty>
                    </motion.div>
                )}
            </AnimatePresence>

            {(serverStatus == 'ready' && (status == 'idle' || status === 'loading')) && (
                <motion.div
                    className="max-w-2xl mx-auto flex flex-col gap-8 py-4"
                    variants={mainSequence}
                    initial={shouldReduceMotion ? false : "hidden"}
                    animate="visible"
                >
                    <div className="flex flex-col">
                        <motion.div variants={fadeUp}>
                            <Empty>
                                <EmptyHeader>
                                    <EmptyTitle as="h1">{t('home.startBreath')}</EmptyTitle>
                                </EmptyHeader>
                            </Empty>
                        </motion.div>
                        <motion.div variants={afterTitle} className="w-full flex justify-center flex flex-col gap-12">
                            <Empty>
                                <motion.div variants={fadeUpSlow}>
                                    <EmptyDescription>
                                        {t('home.locationPrompt')}
                                    </EmptyDescription>
                                </motion.div>
                                <motion.div variants={fadeUpSlow} className="w-full">
                                    <EmptyContent className="flex-row justify-center gap-2 max-w-full">
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
                                </motion.div>
                            </Empty>

                            <motion.div variants={fadeUpSlow} className="flex flex-col gap-4">
                                <p className="text-sm text-neutral-600">{t('home.disclaimerLocation')}</p>
                                <p className="text-sm text-neutral-600">{t('home.disclaimerProject')}</p>
                                <p className="text-sm font-semibold text-neutral-600">{t('home.disclaimerWarning')}</p>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div >


            )
            }

            {
                serverStatus == 'ready' && status === 'error' && (
                    <motion.div className="max-w-2xl mx-auto flex flex-col gap-8 py-4" variants={stagger} initial={shouldReduceMotion ? false : "hidden"} animate="visible">
                        <Empty>
                            <motion.div variants={fadeUp}>
                                <EmptyHeader>
                                    <EmptyTitle as="h1">{t('home.locationNotActive')}</EmptyTitle>
                                    <EmptyDescription>
                                        {t('home.locationNotActiveDescription')}
                                    </EmptyDescription>
                                </EmptyHeader>
                            </motion.div>
                            <motion.div variants={fadeUp}>
                                <EmptyContent className="flex-row justify-center gap-2">
                                    <Button size="lg" onClick={reset} className="w-full">
                                        {t('common.tryAgain')}
                                    </Button>
                                </EmptyContent>
                            </motion.div>
                        </Empty>
                    </motion.div>
                )
            }

            {
                serverStatus == 'ready' && status === 'success' && coords && (
                    <motion.div className="max-w-6xl mx-auto flex flex-col gap-8 py-4" variants={stagger} initial={shouldReduceMotion ? false : "hidden"} animate="visible">
                        <div className="flex w-full min-w-0 flex-1 flex-col gap-8">
                            <motion.h1 variants={fadeUp} className="text-5xl/normal lg:text-6xl/normal font-medium">{t('home.foundYou')}</motion.h1>
                            <div className="flex flex-col lg:flex-row gap-12">
                                <motion.div variants={fadeUp} className="w-full lg:w-2/3 rounded-3xl">
                                    <MapView coords={coords} />
                                </motion.div>
                                <motion.div variants={fadeUp} className="w-full lg:w-1/3 flex flex-col gap-8">
                                    <PlaceDisplay coords={coords} place={place} />
                                    {countryCode && (
                                        <EmergencyNumbers countryCode={countryCode} />
                                    )}
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                )
            }
            <div className="flex justify-center">
                <LanguageSwitcher></LanguageSwitcher>
            </div>
        </>
    )
}
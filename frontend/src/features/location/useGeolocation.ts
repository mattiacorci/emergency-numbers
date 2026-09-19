// Flag USE_MOCK per switchare
// Se mock: ritorna MOCK_COORDS e status 'success'
// Se reale: wrappa navigator.geolocation.getCurrentPosition
// Espone: { coords, status, error }

import type { Coords, Status } from '@/types'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface GeoLocationState {
    coords: Coords | null
    status: Status
    error: string | null
    errorCode?: number | null
}


export function useGeolocation(): GeoLocationState & { start: () => void, reset: () => void } {
    const { t } = useTranslation();

    const [state, setState] = useState<GeoLocationState>({
        coords: null,
        status: 'idle',
        error: null
    });

    const [watchId, setWatchId] = useState<number | null>(null);


    const reset = useCallback(() => {
        setState({ coords: null, status: 'idle', error: null })
    }, []);

    const start = useCallback(() => {
        setState({ coords: null, status: 'loading', error: null })


        if (!navigator.geolocation) {
            setState({
                coords: null,
                status: 'error',
                error: t('geolocation.unsupported'),
                errorCode: null,
            });
            return;
        }

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                setState({
                    coords: {
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    },
                    status: 'success',
                    error: null,
                    errorCode: null
                });
            },
            (error) => {
                const messages: Record<number, string> = {
                    1: t('geolocation.permissionDenied'),
                    2: t('geolocation.positionUnavailable'),
                    3: t('geolocation.timeout'),
                }
                setState({
                    coords: null,
                    status: 'error',
                    error: messages[error.code] ?? t('geolocation.unknown'),
                })
            }, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
        }
        );

        setWatchId(watchId);
    }, [t])

    useEffect(() => {
        return () => {
            if (watchId !== null) {
                navigator.geolocation.clearWatch(watchId);
            }
        }
    }, [watchId])

    return { ...state, start, reset };
}


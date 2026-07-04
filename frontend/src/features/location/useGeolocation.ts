// Flag USE_MOCK per switchare
// Se mock: ritorna MOCK_COORDS e status 'success'
// Se reale: wrappa navigator.geolocation.getCurrentPosition
// Espone: { coords, status, error }

import type { Coords, Status } from '@/types'
import { useCallback, useEffect, useState } from 'react'
import { MOCK_COORDS_MILANO, MOCK_COORDS_NEW_YORK } from './mocks/coords'

interface GeoLocationState {
    coords: Coords | null
    status: Status
    error: string | null
    errorCode?: number | null
}


export function useGeolocation(): GeoLocationState & { start: () => void, reset: () => void } {

    const SIMULATE_GEOLOCATION = true; // Set to true to simulate geolocation for testing
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
                error: 'Geolocation is not supported.',
                errorCode: null,
            });
            return;
        }

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                if (SIMULATE_GEOLOCATION) {
                    const MOCK_COORDS = MOCK_COORDS_NEW_YORK; // Puoi cambiare con MOCK_COORDS_NEW_YORK o MOCK_COORDS_NAPOLI per testare altre coordinate
                    setState({
                        coords: {

                            lat: MOCK_COORDS.lat,
                            lon: MOCK_COORDS.lon,
                            accuracy: MOCK_COORDS.accuracy
                        },
                        status: 'success',
                        error: null,
                        errorCode: null
                    });

                    return;
                }
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
                    1: 'Geolocation permission denied',
                    2: 'Position not available',
                    3: 'Timeout in position request',
                }
                setState({
                    coords: null,
                    status: 'error',
                    error: messages[error.code] ?? 'Unknown error',
                })
            }, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
        }
        );

        setWatchId(watchId);
    }, [])

    useEffect(() => {
        return () => {
            if (watchId !== null) {
                navigator.geolocation.clearWatch(watchId);
            }
        }
    }, [watchId])

    return { ...state, start, reset };
}


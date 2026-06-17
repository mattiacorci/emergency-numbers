// Flag USE_MOCK per switchare
// Se mock: ritorna MOCK_COORDS e status 'success'
// Se reale: wrappa navigator.geolocation.getCurrentPosition
// Espone: { coords, status, error }

import type { Coords, Status } from '@/types'
import { useEffect, useState } from 'react'

interface GeoLocationState {
    coords: Coords | null
    status: Status
    error: string | null
    errorCode?: number | null
}


export function useGeolocation(): GeoLocationState {
    const [state, setState] = useState<GeoLocationState>({
        coords: null,
        status: 'idle',
        error: null,
        errorCode: null
    })

    useEffect(() => {
        if (false) {
            // MOCK
            return;
        }

        if (!navigator.geolocation) {
            setState({
                coords: null,
                status: 'error',
                error: 'Geolocation is not supported.',
                errorCode: null
            });
            return;
        }

        setState(prev => ({ ...prev, status: 'loading' }))

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                setState({
                    coords: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
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

        return () => navigator.geolocation.clearWatch(watchId);

    }, [])

    return state;
}
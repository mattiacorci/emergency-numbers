import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Coords } from '@/types'
import { useReverseGeocode } from './useReverseGeocode'



describe('useReverseGeocode', () => {
    beforeEach(() => {
        vi.restoreAllMocks()
    })

    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('should retrieve the place name when coordinates are available', async () => {
        const coords: Coords = { lat: 45.4642, lon: 9.1900, accuracy: 10 }

        const mockFetch = vi.fn().mockResolvedValue({
            json: async () => ({
                display_name: 'Via Roma, Milano, Italia',
            }),
        })

        vi.stubGlobal('fetch', mockFetch)

        const { result } = renderHook(() => useReverseGeocode(coords))

        await waitFor(() => {
            expect(result.current?.display_name).toBe('Via Roma, Milano, Italia')
        })

        expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining('lat=45.4642')
        )
        expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining('lon=9.19')
        )
    })

    it('should return null when coordinates are not available', async () => {
        const { result } = renderHook(() => useReverseGeocode(null));

        await waitFor(() => {
            expect(result.current).toBeNull();
        });
    });

    it('should handle fetch errors gracefully', async () => {
        const coords: Coords = { lat: 45.4642, lon: 9.1900, accuracy: 10 }

        const mockFetch = vi.fn().mockRejectedValue(new Error('Fetch error'));

        vi.stubGlobal('fetch', mockFetch)

        const { result } = renderHook(() => useReverseGeocode(coords))

        await waitFor(() => {
            expect(result.current).toBeNull()
        })
    });

});
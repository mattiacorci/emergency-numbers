import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { API_BASE_URL } from '@/config/api';
import { useEmergencyRegion } from './useEmergencyRegion';

describe('useEmergencyRegion', () => {
    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    it('fetches the emergency region and maps the DTO to the domain model', async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            json: vi.fn().mockResolvedValue({
                iso_code: 'IT',
                last_verified: '2024-12-15',
                name: 'Italy',
                status: 'active',
                numbers: [
                    { number: '112', number_type: 'general', label: 'Emergenza', is_primary: true },
                    { number: '113', number_type: 'police', label: 'Polizia', is_primary: false },
                ],
                resolved_from: null,
                source_url: 'https://example.com/it',
                valid_until: '2025-12-31',
            }),
        });

        vi.stubGlobal('fetch', fetchMock);

        const { result } = renderHook(() => useEmergencyRegion('IT'));

        await waitFor(() => {
            expect(fetchMock).toHaveBeenCalledWith(`${API_BASE_URL}/api/emergency-numbers/IT/`);
        });

        await waitFor(() => {
            expect(result.current).toMatchObject({
                iso_code: 'IT',
                name: 'Italy',
                status: 'active',
                source_url: 'https://example.com/it',
            });
            expect(result.current?.last_verified).toBeInstanceOf(Date);
            expect(result.current?.valid_until).toBeInstanceOf(Date);
            expect(result.current?.numbers).toHaveLength(2);
        });
    });

    it('does not fetch when countryCode is empty', async () => {
        const fetchMock = vi.fn();
        vi.stubGlobal('fetch', fetchMock);

        const { result } = renderHook(() => useEmergencyRegion(''));

        await waitFor(() => {
            expect(fetchMock).not.toHaveBeenCalled();
        });

        expect(result.current).toBeUndefined();
    });

    it('logs and leaves the state undefined when the request fails', async () => {
        const logSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
        const fetchMock = vi.fn().mockRejectedValue(new Error('network'));
        vi.stubGlobal('fetch', fetchMock);

        const { result } = renderHook(() => useEmergencyRegion('FR'));

        await waitFor(() => {
            expect(fetchMock).toHaveBeenCalledWith(`${API_BASE_URL}/api/emergency-numbers/FR/`);
            expect(logSpy).toHaveBeenCalledWith('Error fetching emergency numbers:', expect.any(Error));
        });

        expect(result.current).toBeUndefined();
    });
});
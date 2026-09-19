import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useBackendStatus } from './useBackendStatus';

describe('useBackendStatus', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    it('starts in checking and becomes ready when the backend answers successfully', async () => {
        const fetchMock = vi.fn().mockResolvedValue({ ok: true });
        vi.stubGlobal('fetch', fetchMock);

        const { result } = renderHook(() => useBackendStatus());

        expect(result.current).toBe('checking');

        await act(async () => {
            await Promise.resolve();
        });

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('/api/health/'));
        expect(result.current).toBe('ready');
    });

    it('switches to waking when the backend takes longer than the grace period', async () => {
        const fetchMock = vi.fn().mockImplementation(() => new Promise(() => undefined));
        vi.stubGlobal('fetch', fetchMock);

        const { result } = renderHook(() => useBackendStatus());

        expect(result.current).toBe('checking');

        await act(async () => {
            vi.advanceTimersByTime(1500);
        });

        expect(result.current).toBe('waking');
    });

    it('marks the backend as unreachable when the health check fails', async () => {
        const fetchMock = vi.fn().mockRejectedValue(new Error('offline'));
        vi.stubGlobal('fetch', fetchMock);

        const { result } = renderHook(() => useBackendStatus());

        await act(async () => {
            await Promise.resolve();
            vi.advanceTimersByTime(2000);
            await Promise.resolve();
        });

        expect(fetchMock).toHaveBeenCalledTimes(2);
        expect(result.current).toBe('unreachable');
    });
});
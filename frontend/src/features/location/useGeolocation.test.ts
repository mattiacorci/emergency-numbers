// useGeolocation.test.ts
import { renderHook, act } from '@testing-library/react'
import { vi, beforeEach } from 'vitest'
import { useGeolocation } from './useGeolocation'

const mockGeolocation = {
    watchPosition: vi.fn(),
    clearWatch: vi.fn(),
}

describe('useGeolocation', () => {

    beforeEach(() => {
        vi.stubGlobal('navigator', { geolocation: mockGeolocation })
        vi.clearAllMocks()
    })


    it('Should be idle initially', () => {
        const { result } = renderHook(() => useGeolocation())

        expect(result.current.status).toBe('idle')
        expect(result.current.coords).toBeNull()
        expect(result.current.error).toBeNull()
    })

    it('Should transition to loading when start is called', () => {
        mockGeolocation.watchPosition.mockImplementation(() => 42) // watchId

        const { result } = renderHook(() => useGeolocation())

        act(() => result.current.start())

        expect(result.current.status).toBe('loading')
    })

    it('Should update coords when geolocation responds', () => {
        mockGeolocation.watchPosition.mockImplementation((onSuccess) => {
            onSuccess({
                coords: { latitude: 45.4, longitude: 10.9, accuracy: 10 }
            })
            return 42
        })

        const { result } = renderHook(() => useGeolocation())
        act(() => result.current.start())

        expect(result.current.status).toBe('success')
        expect(result.current.coords).toEqual({ lat: 45.4, lon: 10.9, accuracy: 10 })
    })

    it('Should show error for permission denied (code 1)', () => {
        mockGeolocation.watchPosition.mockImplementation((_, onError) => {
            onError({ code: 1 })
            return 42
        })

        const { result } = renderHook(() => useGeolocation())
        act(() => result.current.start())

        expect(result.current.status).toBe('error')
        expect(result.current.error).toBe('Geolocation permission denied')
    })

    it('Should show error if geolocation is not supported', () => {
        vi.stubGlobal('navigator', { geolocation: undefined })

        const { result } = renderHook(() => useGeolocation())
        act(() => result.current.start())

        expect(result.current.status).toBe('error')
        expect(result.current.error).toBe('Geolocation is not supported.')
    })

    it('Should call clearWatch on cleanup', () => {
        mockGeolocation.watchPosition.mockReturnValue(42)

        const { result, unmount } = renderHook(() => useGeolocation())
        act(() => result.current.start())
        unmount()

        expect(mockGeolocation.clearWatch).toHaveBeenCalledWith(42)
    })
});
// useGeolocation.test.ts
import { renderHook, act } from '@testing-library/react'
import { vi, beforeEach } from 'vitest'
import { useGeolocation } from './useGeolocation'

const mockGeolocation = {
    watchPosition: vi.fn(),
    clearWatch: vi.fn()
}

beforeEach(() => {
    vi.stubGlobal('navigator', { geolocation: mockGeolocation })
    vi.clearAllMocks()
})

it('stato iniziale è idle', () => {
    const { result } = renderHook(() => useGeolocation())

    expect(result.current.status).toBe('idle')
    expect(result.current.coords).toBeNull()
    expect(result.current.error).toBeNull()
})

it('passa a loading quando chiami start', () => {
    mockGeolocation.watchPosition.mockImplementation(() => 42) // watchId

    const { result } = renderHook(() => useGeolocation())

    act(() => result.current.start())

    expect(result.current.status).toBe('loading')
})

it('aggiorna coords quando geolocation risponde', () => {
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

it('errore permission denied (code 1)', () => {
    mockGeolocation.watchPosition.mockImplementation((_, onError) => {
        onError({ code: 1 })
        return 42
    })

    const { result } = renderHook(() => useGeolocation())
    act(() => result.current.start())

    expect(result.current.status).toBe('error')
    expect(result.current.error).toBe('Geolocation permission denied')
})

it('errore se geolocation non è supportata', () => {
    vi.stubGlobal('navigator', { geolocation: undefined })

    const { result } = renderHook(() => useGeolocation())
    act(() => result.current.start())

    expect(result.current.status).toBe('error')
    expect(result.current.error).toBe('Geolocation is not supported.')
})

it('chiama clearWatch al cleanup', () => {
    mockGeolocation.watchPosition.mockReturnValue(42)

    const { result, unmount } = renderHook(() => useGeolocation())
    act(() => result.current.start())
    unmount()

    expect(mockGeolocation.clearWatch).toHaveBeenCalledWith(42)
})
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { HomePage } from './HomePage'
import { useGeolocation } from '@/features/location/useGeolocation'
import { useReverseGeocode } from '@/features/location/useReverseGeocode'
import { useBackendStatus } from '@/hooks/useBackendStatus'

vi.mock('@/features/location/useGeolocation', () => ({
    useGeolocation: vi.fn(),
}))

vi.mock('@/features/location/useReverseGeocode', () => ({
    useReverseGeocode: vi.fn(),
}))

vi.mock('@/hooks/useBackendStatus', () => ({
    useBackendStatus: vi.fn(),
}))

vi.mock('@/features/location/PlaceDisplay', () => ({
    PlaceDisplay: ({ coords, place }: { coords: { lat: number }; place: { display_name?: string } | null }) => (
        <div>
            {place?.display_name ?? 'place'} - {coords.lat}
        </div>
    ),
}))

vi.mock('@/features/location/MapView', () => ({
    MapView: ({ coords }: { coords: { lat: number } }) => <div>Map for {coords.lat}</div>,
}))

vi.mock('@/features/emergency/EmergencyNumbers', () => ({
    EmergencyNumbers: ({ countryCode }: { countryCode: string }) => <div>EmergencyNumbers for {countryCode}</div>,
}))

const mockedUseGeolocation = vi.mocked(useGeolocation)
const mockedUseReverseGeocode = vi.mocked(useReverseGeocode)
const mockedUseBackendStatus = vi.mocked(useBackendStatus)

describe('HomePage', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('Should show the initial state and call start when clicked', async () => {
        const start = vi.fn()
        const reset = vi.fn()

        mockedUseGeolocation.mockReturnValue({
            coords: null,
            status: 'idle',
            error: null,
            start,
            reset,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any)
        mockedUseReverseGeocode.mockReturnValue(null)
        mockedUseBackendStatus.mockReturnValue('ready')

        const user = userEvent.setup()
        render(<HomePage />)

        expect(screen.getByText(/start by taking a deep breath/i)).toBeInTheDocument()

        await user.click(screen.getByRole('button', { name: /get current location/i }))

        expect(start).toHaveBeenCalledTimes(1)
    })

    it('Should show the success screen with map, location and emergency numbers', () => {
        const start = vi.fn()
        const reset = vi.fn()

        mockedUseGeolocation.mockReturnValue({
            coords: { lat: 45.4642, lon: 9.19, accuracy: 10 },
            status: 'success',
            error: null,
            start,
            reset,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any)

        mockedUseReverseGeocode.mockReturnValue({
            display_name: 'Milano, Italia',
            address: { 'ISO3166-2-lvl6': 'IT-25' },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any)
        mockedUseBackendStatus.mockReturnValue('ready')

        render(<HomePage />)

        expect(screen.getByText(/ok, found you/i)).toBeInTheDocument()
        expect(screen.getByText(/milano, italia - 45.4642/i)).toBeInTheDocument()
        expect(screen.getByText(/emergencynumbers for it-25/i)).toBeInTheDocument()
    })
})
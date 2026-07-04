import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { EmergencyRegion } from '@/types'
import { EmergencyNumbers } from './EmergencyNumbers'
import { useEmergencyRegion } from './useEmergencyRegion'

vi.mock('./useEmergencyRegion', () => ({
    useEmergencyRegion: vi.fn(),
}))

vi.mock('./EmergencyCard', () => ({
    EmergencyCard: ({ number, className }: { number: { label: string; number: string }; className?: string }) => (
        <div data-testid={`emergency-card-${number.number}`} className={className}>
            {number.label}: {number.number}
        </div>
    ),
}))

const mockedUseEmergencyRegion = vi.mocked(useEmergencyRegion)

describe('EmergencyNumbers', () => {
    it('Should show a message when there are no numbers for the region', () => {
        mockedUseEmergencyRegion.mockReturnValue(undefined)

        render(<EmergencyNumbers countryCode="IT" />)

        expect(screen.getByText(/no emergency numbers found/i)).toBeInTheDocument()
    })

    it('Should display the primary number and secondary numbers', () => {
        const region: EmergencyRegion = {
            iso_code: 'IT',
            name: 'Italy',
            status: 'active',
            resolved_from: null,
            source_url: 'https://example.com',
            valid_until: null,
            last_verified: new Date('2024-01-01'),
            numbers: [
                { label: 'Emergenza', number: '112', is_primary: true, number_type: 'general' },
                { label: 'Polizia', number: '113', is_primary: false, number_type: 'police' },
            ],
        }

        mockedUseEmergencyRegion.mockReturnValue(region)

        render(<EmergencyNumbers countryCode="IT" />)

        expect(screen.getByText('Emergenza: 112')).toBeInTheDocument()
        expect(screen.getByText('Polizia: 113')).toBeInTheDocument()
    })
})
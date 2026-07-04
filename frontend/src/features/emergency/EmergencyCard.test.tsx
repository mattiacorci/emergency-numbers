import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { EmergencyNumber } from '@/types'
import { EmergencyCard } from './EmergencyCard'

vi.mock('@/hooks/use-mobile', () => ({
    useIsMobile: () => false,
}))

describe('EmergencyCard', () => {
    it('mostra label e numero', () => {
        const number: EmergencyNumber = {
            label: 'Emergenza sanitaria',
            number: '112',
            is_primary: true,
            number_type: 'medical',
        }

        render(<EmergencyCard number={number} />)

        expect(screen.getByRole('button', { name: /emergenza sanitaria/i })).toBeInTheDocument()
        expect(screen.getByText('112')).toBeInTheDocument()
    })

    it('apre il drawer e mostra il contenuto quando clicchi', async () => {
        const user = userEvent.setup()
        const number: EmergencyNumber = {
            label: 'Polizia',
            number: '113',
            is_primary: false,
            number_type: 'police',
        }

        render(<EmergencyCard number={number} />)

        await user.click(screen.getByRole('button', { name: /polizia/i }))

        expect(screen.getByText(/you can call the single emergency number/i)).toBeInTheDocument()
        expect(screen.getByRole('heading', { name: /polizia/i })).toBeInTheDocument()
    })
})

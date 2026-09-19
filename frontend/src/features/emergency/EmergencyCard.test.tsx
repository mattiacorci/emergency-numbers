import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { EmergencyNumber } from '@/types'
import { EmergencyCard } from './EmergencyCard'

vi.mock('@/hooks/use-mobile', () => ({
    useIsMobile: () => false,
}))

describe('EmergencyCard', () => {
    it('Should display the label and number', () => {
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

    it('Should change color based on number type', () => {

        for (const type of ['medical', 'police', 'fire'] as const) {
            const number: EmergencyNumber = {
                label: 'Foo emergency number ' + type,
                number: '112',
                is_primary: false,
                number_type: type,
            }

            render(<EmergencyCard number={number} />);
            expect(screen.getByRole('button', { name: new RegExp(`Foo emergency number ${type}`, 'i') })).toHaveClass(`bg-${type}`);
        }
    })

    it('Should have a primary number badge if is_primary is true', () => {
        const number: EmergencyNumber = {
            label: 'Foo emergency number',
            number: '112',
            is_primary: true,
            number_type: 'general',
        }

        render(<EmergencyCard number={number} />)

        expect(screen.getByRole('button', { name: /Foo emergency number/i })).toHaveClass('bg-brand');
    });



    it('Should open the drawer and show the relevant emergency message based on operator type', async () => {
        const user = userEvent.setup()
        const number: EmergencyNumber = {
            label: 'Polizia',
            number: '113',
            is_primary: false,
            number_type: 'police',
        }

        render(<EmergencyCard number={number} />)

        await user.click(screen.getByRole('button', { name: /polizia/i }))

        expect(screen.getByText(/use this number to report a crime/i)).toBeInTheDocument()
        expect(screen.getByRole('heading', { name: /polizia/i })).toBeInTheDocument()
    })
})

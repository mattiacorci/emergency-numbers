import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Spinner } from './spinner'

describe('Spinner', () => {
    it('renderizza un elemento di caricamento con attributi accessibili', () => {
        render(<Spinner className="custom-class" data-testid="spinner" />)

        const element = screen.getByTestId('spinner')

        expect(element).toBeInTheDocument()
        expect(element).toHaveAttribute('role', 'status')
        expect(element).toHaveAttribute('aria-label', 'Loading')
        expect(element).toHaveAttribute('data-slot', 'spinner')
        expect(element).toHaveClass('animate-spin', 'custom-class')
    })
})

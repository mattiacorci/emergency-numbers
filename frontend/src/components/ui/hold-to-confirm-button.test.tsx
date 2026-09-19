import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { HoldToConfirmButton } from './hold-to-confirm-button'

describe('HoldToConfirmButton', () => {
    let now: number

    beforeEach(() => {
        now = 0
        vi.useFakeTimers()
        vi.spyOn(performance, 'now').mockImplementation(() => now)
    })

    afterEach(() => {
        vi.runOnlyPendingTimers()
        vi.useRealTimers()
        vi.restoreAllMocks()
    })

    it('Should render the initial label', () => {
        render(
            <HoldToConfirmButton label="Call now" onConfirm={vi.fn()} />
        )

        expect(screen.getByRole('button', { name: /call now/i })).toBeInTheDocument()
    })

    it('Should not call onConfirm before three seconds', () => {
        const onConfirm = vi.fn()

        render(
            <HoldToConfirmButton label="Call now" holdingLabel="Hold" holdDurationMs={3000} onConfirm={onConfirm} />
        )

        const button = screen.getByRole('button', { name: /call now/i })

        fireEvent.pointerDown(button)
        act(() => {
            now += 2999
            vi.advanceTimersByTime(16)
        })

        expect(onConfirm).not.toHaveBeenCalled()

        act(() => {
            now += 1
            vi.advanceTimersByTime(16)
        })
        expect(onConfirm).toHaveBeenCalledTimes(1)
    })

    it('Should not call onConfirm if the mouse leaves the button', () => {
        const onConfirm = vi.fn()

        render(
            <HoldToConfirmButton label="Call now" holdingLabel="Hold" holdDurationMs={3000} onConfirm={onConfirm} />
        )

        const button = screen.getByRole('button', { name: /call now/i })

        fireEvent.pointerDown(button)
        act(() => {
            now += 1000
            vi.advanceTimersByTime(16)
        })

        fireEvent.pointerLeave(button)

        act(() => {
            now += 3000
            vi.advanceTimersByTime(16)
        })

        expect(onConfirm).not.toHaveBeenCalled()
    })

    it('Should support touch interactions instead of click', () => {
        const onConfirm = vi.fn()

        render(
            <HoldToConfirmButton label="Call now" holdingLabel="Hold" holdDurationMs={3000} onConfirm={onConfirm} />
        )

        const button = screen.getByRole('button', { name: /call now/i })

        fireEvent.pointerDown(button, { pointerType: 'touch' })
        act(() => {
            now += 3000
            vi.advanceTimersByTime(16)
        })

        expect(onConfirm).toHaveBeenCalledTimes(1)
    })

    it('Should support holding Enter from the keyboard', () => {
        const onConfirm = vi.fn()

        render(
            <HoldToConfirmButton label="Call now" holdingLabel="Hold" holdDurationMs={3000} onConfirm={onConfirm} />
        )

        const button = screen.getByRole('button', { name: /call now/i })

        fireEvent.keyDown(button, { key: 'Enter' })
        act(() => {
            now += 3000
            vi.advanceTimersByTime(16)
        })
        fireEvent.keyUp(button, { key: 'Enter' })

        expect(onConfirm).toHaveBeenCalledTimes(1)
    })
})

import * as React from "react"
import { Button } from "./button"

import type { buttonVariants } from "./button"
import type { VariantProps } from "class-variance-authority"

type HoldToConfirmButtonProps = React.ComponentProps<typeof Button> &
    VariantProps<typeof buttonVariants> & {
        /** durata della pressione richiesta, in ms */
        holdDurationMs?: number
        /** label di default*/
        label: React.ReactNode
        /** label mostratoa alla pressione  */
        holdingLabel?: string
        /** callback invocata una sola volta al raggiungimento del 100% */
        onConfirm: () => void
    }


export function HoldToConfirmButton({
    label,
    holdingLabel = "Keep pressed for 3 seconds",
    holdDurationMs = 3000,
    onConfirm,
    className,
    disabled,
    ...props
}: HoldToConfirmButtonProps) {
    const [progress, setProgress] = React.useState(0);
    const [isHolding, setIsHolding] = React.useState(false);

    const startRef = React.useRef<number | null>(null);
    const firedRef = React.useRef(false);
    const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

    const stopAnimationFn = () => {
        setIsHolding(false);
        setProgress(0);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const startAnimationFn = () => {
        if (disabled) return;

        setIsHolding(true);
        setProgress(0);

        firedRef.current = false;
        startRef.current = performance.now();

        intervalRef.current = setInterval(() => {
            if (startRef.current !== null) {
                const elapsed = performance.now() - startRef.current;
                const progressPercent = Math.min((elapsed / holdDurationMs) * 100, 100);
                setProgress(progressPercent);

                if (progressPercent >= 100 && !firedRef.current) {
                    firedRef.current = true;
                    onConfirm();
                    stopAnimationFn();
                }
            }
        }, 16); // ~60 FPS
    };



    return (
        <Button
            onPointerDown={startAnimationFn}
            onPointerUp={stopAnimationFn}
            onPointerLeave={stopAnimationFn}
            onPointerCancel={stopAnimationFn}
            size="lg"
            disabled={disabled}
            className={`relative overflow-hidden ${className}`}
            {...props}
        >
            <span className="absolute inset-0 bg-black/50" style={{ width: `${progress}%` }} />
            <span className="relative z-10">{isHolding ? holdingLabel : label}</span>
        </Button>
    )
}
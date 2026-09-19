import * as React from "react"
import { useTranslation } from "react-i18next"
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
    holdingLabel,
    holdDurationMs = 3000,
    onConfirm,
    className,
    disabled,
    ...props
}: HoldToConfirmButtonProps) {
    const { t } = useTranslation();
    const resolvedHoldingLabel = holdingLabel ?? t('emergency.keepPressed');
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
        if (disabled || startRef.current !== null) return;

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

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if ((event.key === "Enter" || event.key === " ") && !event.repeat) {
            event.preventDefault();
            startAnimationFn();
        }
    };

    const handleKeyUp = (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            stopAnimationFn();
        }
    };



    return (
        <Button
            onPointerDown={startAnimationFn}
            onPointerUp={stopAnimationFn}
            onPointerLeave={stopAnimationFn}
            onPointerCancel={stopAnimationFn}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            onBlur={stopAnimationFn}
            size="lg"
            disabled={disabled}
            className={`relative overflow-hidden ${className}`}
            {...props}
        >
            <span className="absolute inset-0 bg-black/50" style={{ width: `${progress}%` }} />
            <span className="relative z-10">{isHolding ? resolvedHoldingLabel : label}</span>
        </Button>
    )
}
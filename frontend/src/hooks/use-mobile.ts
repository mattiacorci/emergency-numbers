import { useSyncExternalStore } from "react";

function subscribeToMediaChange(callback: () => void, breakpoint: number) {
    const mediaQueryMatch = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    mediaQueryMatch.addEventListener("change", callback);
    return () => mediaQueryMatch.removeEventListener("change", callback);
}

export function useIsMobile(mobileBreakpoint = 768) {
    return useSyncExternalStore(
        (callback) => subscribeToMediaChange(callback, mobileBreakpoint),
        () => window.innerWidth < mobileBreakpoint, // getSnapshot (client)
        () => false // getServerSnapshot (SSR fallback, evita mismatch)
    );
}

import { useEffect, useState } from "react";
import { API_BASE_URL } from '@/config/api';

type Status = 'checking' | 'waking' | 'ready' | 'unreachable';
const WAKING_TIMEOUT = 1500;
const MAX_ATTEMPTS = 10;
const TROTTLING = 2000;

export function useBackendStatus() {
    const [status, setStatus] = useState<Status>("checking");


    useEffect(() => {
        let cancelled = false;
        let attemps = 0;
        const slowTimer = setTimeout(() => {
            setStatus((s) => s === 'checking' ? 'waking' : s);
        }, WAKING_TIMEOUT);

        const ping = async () => {
            while (!cancelled && attemps < MAX_ATTEMPTS) {
                attemps++;

                try {
                    const res = await fetch(`${API_BASE_URL}/api/health/`);
                    if (res.ok) {
                        setStatus("ready");
                        return;
                    }
                } catch {
                    setStatus("unreachable");
                }
                await new Promise((r) => setTimeout(r, TROTTLING));
            }
            setStatus("unreachable");
        };

        ping();

        return () => {
            cancelled = true;
            clearTimeout(slowTimer);
        }
    }, []);

    return status;
}
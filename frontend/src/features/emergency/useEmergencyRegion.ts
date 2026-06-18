// Props: countryCode: string
// Flag USE_MOCK per switchare
// Se mock: ritorna MOCK_EMERGENCY_NUMBERS[countryCode]
// Se reale: fetch al BE /api/emergency-numbers?country=XX
// Espone: { numbers, loading, error }

import type { EmergencyRegion, EmergencyRegionDTO } from "@/types/emergency.types";
import { useEffect, useState } from "react";
import { API_BASE_URL } from '@/config/api';


export function useEmergencyRegion(countryCode: string): EmergencyRegion | undefined {
    const [emergencyRegion, setEmergencyRegion] = useState<EmergencyRegion>();

    useEffect(() => {
        if (!countryCode) {
            setEmergencyRegion([]);
            return;
        }
        fetch(`${API_BASE_URL}/api/emergency-numbers/${countryCode}/`)
            .then(res => res.json())
            .then(data => setEmergencyRegion(toEmergencyRegion(data)))
            .catch(err => {
                console.error("Error fetching emergency numbers:", err);
                setEmergencyRegion([]);
            });
    }, [countryCode]);

    return emergencyRegion;
}

function parseDateOnly(s: string): Date {
  const [year, month, day] = s.split('-').map(Number);
  return new Date(year, month - 1, day); // locale, non UTC
}

function toEmergencyRegion(dto: EmergencyRegionDTO): EmergencyRegion {
  return {
    ...dto,
    valid_until:   dto.valid_until ? parseDateOnly(dto.valid_until) : null,
    last_verified: parseDateOnly(dto.last_verified),
  };
}
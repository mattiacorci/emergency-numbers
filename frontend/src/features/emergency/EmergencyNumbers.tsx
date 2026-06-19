// Consuma useLocation() per avere countryCode
// Consuma useEmergencyNumbers(countryCode)
// Renderizza lista di EmergencyCard
// Gestisce stato loading/error/empty con StatusBanner

import { EmergencyCard } from "./EmergencyCard";
import { useEmergencyRegion } from "./useEmergencyRegion";

export function EmergencyNumbers({ countryCode }: { countryCode: string }) {

    const emergencyRegion = useEmergencyRegion(countryCode);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Emergency Numbers</h2>
            {emergencyRegion?.numbers.length === 0 && (
                <p>No emergency numbers found for this region.</p>
            )}

            {emergencyRegion && emergencyRegion.numbers.length > 0 && (
                <div className="grid gap-4">
                    {emergencyRegion.numbers.map((num, idx) => (
                        <EmergencyCard key={idx} number={num} />
                    ))}
                </div>
            )}
        </div>
    )
}

// Consuma useLocation() per avere countryCode
// Consuma useEmergencyNumbers(countryCode)
// Renderizza lista di EmergencyCard
// Gestisce stato loading/error/empty con StatusBanner

import { EmergencyCard } from "./EmergencyCard";
import { useEmergencyRegion } from "./useEmergencyRegion";

export function EmergencyNumbers({ countryCode }: { countryCode: string }) {

    const emergencyRegion = useEmergencyRegion(countryCode);
    const primaryNumber = emergencyRegion?.numbers.find(num => num.is_primary);
    const secondaryNumbers = emergencyRegion?.numbers.filter(num => !num.is_primary);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Emergency Numbers</h2>
            {(!emergencyRegion || emergencyRegion?.numbers.length === 0) && (
                <p>No emergency numbers found for this region.</p>
            )}
            <div className="flex flex-col gap-4">
                {primaryNumber && (
                    <EmergencyCard number={primaryNumber} className="w-full" />
                )}

                {secondaryNumbers && secondaryNumbers.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {secondaryNumbers?.map((num, idx) => (
                            <EmergencyCard key={idx} number={num} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

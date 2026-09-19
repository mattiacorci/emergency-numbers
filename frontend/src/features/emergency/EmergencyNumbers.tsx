// Consuma useLocation() per avere countryCode
// Consuma useEmergencyNumbers(countryCode)
// Renderizza lista di EmergencyCard
// Gestisce stato loading/error/empty con StatusBanner

import { useTranslation } from "react-i18next";
import { EmergencyCard } from "./EmergencyCard";
import { useEmergencyRegion } from "./useEmergencyRegion";
import { motion, useReducedMotion } from "motion/react";
import { fadeUp, stagger } from "@/lib/motion";

export function EmergencyNumbers({ countryCode }: { countryCode: string }) {

    const { t } = useTranslation();
    const shouldReduceMotion = useReducedMotion() ?? false;
    const emergencyRegion = useEmergencyRegion(countryCode);
    const primaryNumber = emergencyRegion?.numbers.find(num => num.is_primary);
    const secondaryNumbers = emergencyRegion?.numbers.filter(num => !num.is_primary);

    return (
        <motion.div variants={stagger} initial={shouldReduceMotion ? false : "hidden"} animate="visible">
            <motion.h2 variants={fadeUp} className="text-2xl font-bold mb-4">{t('emergency.title')}</motion.h2>
            {(!emergencyRegion || emergencyRegion?.numbers.length === 0) && (
                <motion.p variants={fadeUp}>{t('emergency.noNumbers')}</motion.p>
            )}
            <div className="flex flex-col gap-4">
                {primaryNumber && (
                    <motion.div variants={fadeUp}>
                        <EmergencyCard number={primaryNumber} className="w-full" />
                    </motion.div>
                )}

                {secondaryNumbers && secondaryNumbers.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {secondaryNumbers?.map((num, idx) => (
                            <motion.div key={idx} variants={fadeUp}>
                                <EmergencyCard number={num} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    )
}

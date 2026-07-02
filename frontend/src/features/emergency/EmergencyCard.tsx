// Props: { number: EmergencyNumber }
// Mostra name, category, number
// Pulsante "Chiama" con href="tel:XXX"
// Usa Card + Badge di shadcn per la category

import type { EmergencyNumber } from "@/types";


export function EmergencyCard({ number, className }: { number: EmergencyNumber, className?: string }) {

  let colorsClasses = null;

  if (number.is_primary) {
    colorsClasses = "bg-brand text-white hover:bg-brand-hover outline-none outline-blue-500 focus:outline-2 focus:bg-brand-focus";
  } else if (number.number_type === "police") {
    colorsClasses = "bg-police hover:bg-police-hover outline-none outline-blue-500 focus:outline-2 focus:bg-police-focus";
  } else if (number.number_type === "fire") {
    colorsClasses = "bg-fire hover:bg-fire-hover outline-none outline-blue-500 focus:outline-2 focus:bg-fire-focus";
  } else if (number.number_type === "medical") {
    colorsClasses = "bg-medical hover:bg-medical-hover outline-none outline-blue-500 focus:outline-2 focus:bg-medical-focus";
  }

  return (
    <button className={`p-6 rounded-3l text-left rounded-3xl outline-none focus:border-blue-600 focus:outline-2 ${colorsClasses} ${className || ''}`}>
      <h3 className="text-base">{number.label}</h3>
      <p className="text-4xl">
        {number.number}
      </p>
    </button>
  )
}
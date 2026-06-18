// Props: { number: EmergencyNumber }
// Mostra name, category, number
// Pulsante "Chiama" con href="tel:XXX"
// Usa Card + Badge di shadcn per la category

import type { EmergencyNumber } from "@/types";


export function EmergencyCard({ number }: { number: EmergencyNumber }) {
  return (
    <div className="p-4 border rounded shadow">
      <h3 className="text-lg font-bold">{number.label}</h3>
      <p className="text-sm text-gray-600">{number.number_type}</p>
      <a href={`tel:${number.number}`} className="mt-2 inline-block px-4 py-2 bg-blue-500 text-white rounded">
        Chiama
      </a>
    </div>
  )
}
export type Coords = { lat: number; lng: number; accuracy: number }
export type Status = 'idle' | 'loading' | 'success' | 'error'
export type EmergencyNumber = { id: string; name: string; number: string; category: string }
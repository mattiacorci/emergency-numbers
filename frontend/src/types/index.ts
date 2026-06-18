export * from './emergency.types'

export type Coords = { lat: number; lon: number; accuracy: number }
export type Status = 'idle' | 'loading' | 'success' | 'error'

export interface NominatimAddress {
  house_number?: string
  road?: string
  village?: string
  city?: string
  county?: string
  'ISO3166-2-lvl6'?: string
  state?: string
  'ISO3166-2-lvl4'?: string
  postcode?: string
  country?: string
  country_code?: string
}

export interface NominatimResponse {
  place_id: number
  licence: string
  osm_type: string
  osm_id: number
  lat: string
  lon: string
  class: string
  type: string
  place_rank: number
  importance: number
  addresstype: string
  name: string
  display_name: string
  address: NominatimAddress
  boundingbox: [string, string, string, string]
}
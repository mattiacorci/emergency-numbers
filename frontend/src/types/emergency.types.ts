export type RegionStatus = 'active' | 'transitioning' | 'planned';

export type NumberType =
  | 'general'
  | 'police'
  | 'fire'
  | 'medical'
  | 'coast';

// ─── DTO
export interface EmergencyRegionDTO {
  iso_code:      string;
  last_verified: string;
  name:          string
  status:        RegionStatus;
  numbers:       EmergencyNumberDTO[];
  resolved_from: string | null;
  source_url:    string;
  valid_until:   string | null;
}

export interface EmergencyNumberDTO {
  number:      string;
  number_type: NumberType;
  label:       string;
  is_primary:  boolean;
}


// ─── Domain Models

export interface EmergencyNumber {
  number:      string;
  number_type: NumberType;
  label:       string;
  is_primary:  boolean;
}

export interface EmergencyRegion {
  iso_code:      string;
  name:          string;
  status:        RegionStatus;
  resolved_from: string | null;
  source_url:    string;
  valid_until:   Date | null;
  last_verified: Date;
  numbers:       EmergencyNumber[];
}

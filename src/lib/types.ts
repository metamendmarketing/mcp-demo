export type PreferenceKey = 
  | 'primaryPurpose' 
  | 'capacity' 
  | 'lounge' 
  | 'electrical' 
  | 'zipCode' 
  | 'sunExposure' 
  | 'placement' 
  | 'focus' 
  | 'aesthetic' 
  | 'maintenance' 
  | 'intensity' 
  | 'budget' 
  | 'delivery'
  | 'ownership';

/**
 * Global Type Definitions for Marquis Buying Assistant
 */

export interface Hotspot {
  id: string;
  x: number;
  y: number;
  label: string;
  description: string;
  imageUrl?: string;
  direction?: 'top' | 'bottom' | 'left' | 'right';
}

export interface Product {
  id: string;
  modelName: string;
  slug: string;
  marketingSummary?: string;
  therapySummary?: string;
  lengthIn: number;
  widthIn: number;
  depthIn: number;
  jetCount: number;
  seatsMin: number;
  seatsMax: number;
  capacityGallons?: number;
  dryWeightLbs?: number;
  fullWeightLbs?: number;
  pumpFlowGpm?: number;
  electricalAmps?: number;
  usageTags: string[] | string;
  heroImageUrl?: string;
  overheadImageUrl?: string;
  hotspots?: Hotspot[] | string;
  shellColors?: string[] | string;
  cabinetColors?: string[] | string;
  series?: { name: string; positioningTier?: string };
  seriesName?: string;
  positioningTier?: string;
  score?: number;
  staticHeroTitle?: string;
  staticHydrotherapy?: string;
  staticClimate?: string;
  staticDesign?: string;
  staticEfficiency?: string;
  staticDesignConsideration?: string;
  staticReasons?: string[] | string;
}

export interface UserPreferences {
  primaryPurpose: string | null;
  capacity: string | null;
  lounge: string | null;
  electrical: string | null;
  zipCode: string | null;
  sunExposure: string | null;
  placement: string | null;
  focus: string | null;
  aesthetic: string | null;
  maintenance: string | null;
  intensity: string | null;
  budget: string | null;
  delivery: string | null;
  ownership: string | null;
}

export interface ScoredProduct {
  product: Product;
  score: number;
  reasons: string[];
  matchStrategy?: string;
  naturalNarrative?: string;
  designConsiderations?: string;
}

export interface NarrativeResponse {
  heroTitle: string;
  hydrotherapy: string;
  climate: string;
  design: string;
  efficiency: string;
  designConsiderations?: string;
  error?: string;
}

// Fuel Properties Types
export type ReactivityClass = 'low' | 'medium' | 'high';

export interface FuelProperties {
  id: string;
  name: string;
  formula: string;
  heatOfCombustion: number;       // kJ/kg
  laminarBurningVelocity: number; // m/s
  reactivityClass: ReactivityClass;
  lowerFlammableLimit: number;    // vol%
  upperFlammableLimit: number;    // vol%
  vaporDensity: number;           // relative to air
  molecularWeight: number;        // g/mol
}

export type ConfinementLevel = '1D' | '2D' | '2.5D' | '3D';
export type CongestionLevel = 'low' | 'medium' | 'high';

export type WallType = 'steel_plate' | 'reinforced_concrete' | 'precast' | 'modular';
export type BoundaryCondition = 'simply_supported' | 'fixed_fixed' | 'cantilever' | 'fixed_pinned';

// BST Method Output
export interface BSTOutput {
  flameSpeed: number;              // Mach number
  peakOverpressure: number;        // bar
  positivePhaseImpulse: number;    // bar·ms
  positivePhaseDuration: number;   // ms
  scaledDistance: number;
  peakDynamicPressure: number;     // bar
  arrivalTime: number;             // ms
}

// TNT Equivalent Output
export interface TNTOutput {
  tntEquivalentMass: number;       // kg
  scaledDistance: number;
  peakOverpressure: number;        // bar
  positivePhaseImpulse: number;    // bar·ms
  positivePhaseDuration: number;   // ms
  arrivalTime: number;
}

// TNO Multi-Energy Output
export interface TNOOutput {
  sourceStrength: number;
  scaledDistance: number;
  peakOverpressure: number;
  positivePhaseImpulse: number;
  positivePhaseDuration: number;
}

// SDOF Analysis Output
export interface SDOFOutput {
  maxDisplacement: number;         // mm
  ductilityRatio: number;
  supportReaction: number;         // kN
  supportMoment: number;           // kN·m
  dlf: number;
  displacementHistory: Array<{ t: number; x: number }>;
  naturalPeriod: number;           // ms
}

// Blast Wall Design Output
export interface BlastWallOutput {
  requiredThickness: number;       // mm
  weightPerUnitArea: number;       // kg/m²
  maxDeflection: number;           // mm
  ductilityRatio: number;
  supportReaction: number;         // kN/m
  supportMoment: number;           // kN·m/m
  shearAtSupport: number;          // kN/m
  passDeflection: boolean;
  passDuctility: boolean;
  materialRecommendation: string;
}

// Connection Design Output
export interface ConnectionOutput {
  anchorDiameter: number;          // mm
  anchorEmbedment: number;         // mm
  anchorCount: number;
  basePlateThickness: number;      // mm
  weldSize: number;                // mm
  concreteBreakoutCapacity: number; // kN
  demandCapacityRatio: number;
}

// Safe Distance Result
export interface SafeDistanceResult {
  method: string;
  distances: Array<{
    label: string;
    threshold: number;             // bar
    distance: number;              // m
  }>;
}

// Congestion Assessment
export interface CongestionAssessment {
  pipeDensity: { value: number; rating: CongestionLevel };
  equipmentDensity: { value: number; rating: CongestionLevel };
  obstacleSpacing: { value: number; rating: CongestionLevel };
  obstacleLayers: { value: number; rating: CongestionLevel };
  confinedVolumes: { value: string; rating: CongestionLevel };
  overallRating: CongestionLevel;
  confidence: 'high' | 'medium' | 'low';
  justification: string;
}
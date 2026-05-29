import { FuelProperties, ConfinementLevel, CongestionLevel, BSTOutput } from '../types';
import { fuelLibrary } from '../data/fuel-library';

/**
 * Baker-Strehlow-Tang (BST) Method for VCE Blast Analysis
 * Based on Baker, Strehlow, & Tang (1994) and Baker et al. (2012)
 */

// BST flame speed curves - interpolated from Baker et al. figures
// Format: [scaled_distance, flame_speed_mach]
const BST_FLAME_SPEED_CURVES = {
  low: [
    [0.5, 0.1], [1.0, 0.15], [2.0, 0.2], [5.0, 0.25], [10.0, 0.3], [20.0, 0.35]
  ],
  medium: [
    [0.5, 0.3], [1.0, 0.5], [2.0, 0.8], [5.0, 1.2], [10.0, 1.5], [20.0, 1.8]
  ],
  high: [
    [0.5, 0.8], [1.0, 1.5], [2.0, 2.5], [5.0, 3.5], [10.0, 4.2], [20.0, 4.8]
  ]
};

// Confinement/Congestion Matrix for flame speed
const FLAME_SPEED_MATRIX: Record<ConfinementLevel, Record<CongestionLevel, 'low' | 'medium' | 'high'>> = {
  '1D': { low: 'low', medium: 'medium-low', high: 'medium' },
  '2D': { low: 'medium-low', medium: 'medium', high: 'medium-high' },
  '2.5D': { low: 'medium', medium: 'medium-high', high: 'high' },
  '3D': { low: 'medium-high', medium: 'high', high: 'very-high' }
};

// BST overpressure curves (scaled overpressure vs scaled distance for different flame speeds)
const BST_OVERPRESSURE_CURVES: Record<number, Array<[number, number]>> = {
  0.1: [[0.5, 0.001], [1.0, 0.0008], [2.0, 0.0005], [5.0, 0.0002], [10.0, 0.0001]],
  0.5: [[0.5, 0.01], [1.0, 0.008], [2.0, 0.005], [5.0, 0.002], [10.0, 0.001]],
  1.0: [[0.5, 0.05], [1.0, 0.04], [2.0, 0.025], [5.0, 0.01], [10.0, 0.005]],
  2.0: [[0.5, 0.15], [1.0, 0.12], [2.0, 0.08], [5.0, 0.03], [10.0, 0.015]],
  3.0: [[0.5, 0.3], [1.0, 0.25], [2.0, 0.15], [5.0, 0.06], [10.0, 0.03]],
  4.0: [[0.5, 0.5], [1.0, 0.4], [2.0, 0.25], [5.0, 0.1], [10.0, 0.05]],
  5.0: [[0.5, 0.7], [1.0, 0.55], [2.0, 0.35], [5.0, 0.15], [10.0, 0.08]],
};

// BST impulse curves (scaled impulse vs scaled distance)
const BST_IMPULSE_CURVES: Record<number, Array<[number, number]>> = {
  0.1: [[0.5, 0.001], [1.0, 0.0008], [2.0, 0.0005], [5.0, 0.0002], [10.0, 0.0001]],
  0.5: [[0.5, 0.005], [1.0, 0.004], [2.0, 0.003], [5.0, 0.0015], [10.0, 0.0008]],
  1.0: [[0.5, 0.02], [1.0, 0.015], [2.0, 0.01], [5.0, 0.005], [10.0, 0.003]],
  2.0: [[0.5, 0.05], [1.0, 0.04], [2.0, 0.025], [5.0, 0.012], [10.0, 0.006]],
  3.0: [[0.5, 0.08], [1.0, 0.065], [2.0, 0.04], [5.0, 0.02], [10.0, 0.01]],
  4.0: [[0.5, 0.12], [1.0, 0.09], [2.0, 0.06], [5.0, 0.03], [10.0, 0.015]],
  5.0: [[0.5, 0.15], [1.0, 0.12], [2.0, 0.08], [5.0, 0.04], [10.0, 0.02]],
};

/**
 * Linear interpolation
 */
function interpolate(x: number, x0: number, y0: number, x1: number, y1: number): number {
  if (x1 === x0) return y0;
  return y0 + (y1 - y0) * (x - x0) / (x1 - x0);
}

/**
 * Get y value from curve data for given x
 */
function getCurveValue(x: number, curve: Array<[number, number]>): number {
  // Sort curve by x values
  const sorted = [...curve].sort((a, b) => a[0] - b[0]);

  // Extrapolate if outside range
  if (x < sorted[0][0]) {
    return sorted[0][1];
  }
  if (x > sorted[sorted.length - 1][0]) {
    return sorted[sorted.length - 1][1];
  }

  // Interpolate
  for (let i = 0; i < sorted.length - 1; i++) {
    if (x >= sorted[i][0] && x <= sorted[i + 1][0]) {
      return interpolate(x, sorted[i][0], sorted[i][1], sorted[i + 1][0], sorted[i + 1][1]);
    }
  }

  return sorted[sorted.length - 1][1];
}

/**
 * Determine flame speed based on fuel reactivity, confinement, and congestion
 */
function getFlameSpeed(fuel: FuelProperties, confinement: ConfinementLevel, congestion: CongestionLevel): number {
  const reactivity = fuel.reactivityClass;
  const matrixValue = FLAME_SPEED_MATRIX[confinement][congestion];

  // Determine base curve type based on reactivity and matrix value
  let curveType: 'low' | 'medium' | 'high';

  if (reactivity === 'low') {
    curveType = matrixValue === 'very-high' ? 'medium' : 'low';
  } else if (reactivity === 'medium') {
    if (matrixValue === 'low' || matrixValue === 'medium-low') {
      curveType = 'low';
    } else if (matrixValue === 'medium' || matrixValue === 'medium-high') {
      curveType = 'medium';
    } else {
      curveType = 'high';
    }
  } else { // high reactivity
    if (matrixValue === 'low' || matrixValue === 'medium-low') {
      curveType = 'medium';
    } else {
      curveType = 'high';
    }
  }

  const curve = BST_FLAME_SPEED_CURVES[curveType];
  return getCurveValue(1.0, curve); // Return base flame speed at reference distance
}

/**
 * Run BST Analysis
 */
export function runBSTAnalysis(
  fuelId: string,
  flammableMass: number,        // kg
  confinement: ConfinementLevel,
  congestion: CongestionLevel,
  standoffDistance: number,      // m
  ambientPressure: number = 1.013, // bar
  ambientTemperature: number = 293  // K
): BSTOutput {
  // Get fuel properties
  const fuel = fuelLibrary.find(f => f.id === fuelId) || fuelLibrary[0];

  // Calculate energy release (J)
  // E = M * ΔHc (convert kJ/kg to J/kg)
  const energy = flammableMass * fuel.heatOfCombustion * 1000;

  // Calculate Sachs-scaled distance: Z = R / (E/P₀)^(1/3)
  // Convert pressure to Pa for consistent units
  const p0Pa = ambientPressure * 100000; // bar to Pa
  const scaledDistance = standoffDistance / Math.pow(energy / p0Pa, 1/3);

  // Get flame speed
  const flameSpeed = getFlameSpeed(fuel, confinement, congestion);

  // Get scaled overpressure from BST curves
  // Find closest flame speed curve
  const flameSpeedKeys = Object.keys(BST_OVERPRESSURE_CURVES).map(Number).sort((a, b) => a - b);
  let flameSpeedCurve = flameSpeedKeys[0];

  for (let i = 0; i < flameSpeedKeys.length - 1; i++) {
    if (flameSpeed >= flameSpeedKeys[i] && flameSpeed < flameSpeedKeys[i + 1]) {
      flameSpeedCurve = flameSpeedKeys[i];
      break;
    }
    if (flameSpeed >= flameSpeedKeys[i + 1]) {
      flameSpeedCurve = flameSpeedKeys[i + 1];
    }
  }

  const scaledOverpressure = getCurveValue(scaledDistance, BST_OVERPRESSURE_CURVES[flameSpeedCurve] || BST_OVERPRESSURE_CURVES[1.0]);
  const scaledImpulse = getCurveValue(scaledDistance, BST_IMPULSE_CURVES[flameSpeedCurve] || BST_IMPULSE_CURVES[1.0]);

  // Convert to dimensional values
  // Ps = P̄s × P₀
  const peakOverpressure = scaledOverpressure * ambientPressure; // bar

  // is = Īs × P₀^(2/3) × E^(1/3) / c₀
  // Speed of sound in air (m/s)
  const speedOfSound = 331.3 * Math.sqrt(ambientTemperature / 273.15);
  const positivePhaseImpulse = scaledImpulse * Math.pow(ambientPressure * 100000, 2/3) * Math.pow(energy, 1/3) / speedOfSound; // Pa·s

  // Convert impulse to bar·ms
  const impulseBarMs = (positivePhaseImpulse / 100000) * 1000;

  // Estimate positive phase duration: td ≈ 2 * is / Ps
  const positivePhaseDuration = (2 * impulseBarMs) / peakOverpressure; // ms

  // Peak dynamic pressure: q = 0.5 * ρ * v² ≈ 2.5 * Ps² / (Ps + 7) (Sachs scaling)
  const peakDynamicPressure = (2.5 * Math.pow(peakOverpressure, 2)) / (peakOverpressure + 7); // bar

  // Arrival time: ta = R / c₀
  const arrivalTime = (standoffDistance / speedOfSound) * 1000; // ms

  return {
    flameSpeed,
    peakOverpressure,
    positivePhaseImpulse: impulseBarMs,
    positivePhaseDuration,
    scaledDistance,
    peakDynamicPressure,
    arrivalTime
  };
}
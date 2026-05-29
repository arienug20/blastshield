import type { TNTOutput } from '../types';

/**
 * TNT Equivalent Method for VCE Blast Analysis
 * Based on Hopkinson-Cranz scaling and Kingery-Bulmash curves
 */

// Kingery-Bulmash blast parameters for TNT (standard atmosphere)
const TNT_HEAT_OF_COMBUSTION = 4680; // kJ/kg

// Kingery-Bulmash overpressure curve (scaled distance vs peak overpressure)
// Z = R / W^(1/3) where W is TNT mass in kg, R is distance in m
// Returns overpressure in bar
const KINGERY_BULMASH_OVERPRESSURE = [
  [0.1, 100.0],   // Very close - extreme overpressure
  [0.2, 30.0],
  [0.5, 10.0],
  [1.0, 5.0],
  [2.0, 2.5],
  [5.0, 1.0],
  [10.0, 0.5],
  [20.0, 0.2],
  [50.0, 0.08],
  [100.0, 0.03],
  [200.0, 0.015],
  [500.0, 0.005],
  [1000.0, 0.002]
];

// Kingery-Bulmash impulse curve (scaled distance vs scaled impulse)
// Returns scaled impulse (bar·ms·kg^(-1/3))
const KINGERY_BULMASH_IMPULSE = [
  [0.1, 0.8],
  [0.2, 0.6],
  [0.5, 0.45],
  [1.0, 0.35],
  [2.0, 0.28],
  [5.0, 0.20],
  [10.0, 0.15],
  [20.0, 0.11],
  [50.0, 0.07],
  [100.0, 0.05],
  [200.0, 0.035],
  [500.0, 0.025],
  [1000.0, 0.018]
];

/**
 * Linear interpolation
 */
function interpolate(x: number, x0: number, y0: number, x1: number, y1: number): number {
  if (x1 === x0) return y0;
  return y0 + (y1 - y0) * (x - x0) / (x1 - x0);
}

/**
 * Get value from curve data
 */
function getCurveValue(x: number, curve: Array<[number, number]>): number {
  const sorted = [...curve].sort((a, b) => a[0] - b[0]);

  // Extrapolate if outside range
  if (x <= sorted[0][0]) {
    return sorted[0][1];
  }
  if (x >= sorted[sorted.length - 1][0]) {
    // Power-law extrapolation for large distances
    const last = sorted[sorted.length - 1];
    const secondLast = sorted[sorted.length - 2];
    const exponent = Math.log(last[1] / secondLast[1]) / Math.log(last[0] / secondLast[0]);
    return last[1] * Math.pow(x / last[0], exponent);
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
 * Run TNT Equivalent Analysis
 */
export function runTNTAnalysis(
  flammableMass: number,        // kg
  fuelHeatOfCombustion: number, // kJ/kg
  tntEfficiency: number,        // fraction (0.03 to 0.20)
  standoffDistance: number,      // m
  ambientPressure: number = 1.013 // bar
): TNTOutput {
  // Calculate TNT equivalent mass
  // W_TNT = η × M × ΔHc_fuel / ΔHc_TNT
  const tntEquivalentMass = tntEfficiency * flammableMass * fuelHeatOfCombustion / TNT_HEAT_OF_COMBUSTION;

  // Hopkinson-Cranz scaled distance: Z = R / W_TNT^(1/3)
  const scaledDistance = standoffDistance / Math.pow(tntEquivalentMass, 1/3);

  // Get peak overpressure from Kingery-Bulmash curves
  const peakOverpressure = getCurveValue(scaledDistance, KINGERY_BULMASH_OVERPRESSURE);

  // Get scaled impulse
  const scaledImpulse = getCurveValue(scaledDistance, KINGERY_BULMASH_IMPULSE);

  // Convert to dimensional impulse: is = Īs × W_TNT^(1/3)
  const positivePhaseImpulse = scaledImpulse * Math.pow(tntEquivalentMass, 1/3); // bar·ms

  // Estimate positive phase duration: td ≈ 2 * is / Ps
  const positivePhaseDuration = (2 * positivePhaseImpulse) / peakOverpressure; // ms

  // Arrival time (speed of sound in air ~340 m/s)
  const arrivalTime = (standoffDistance / 340) * 1000; // ms

  return {
    tntEquivalentMass,
    scaledDistance,
    peakOverpressure,
    positivePhaseImpulse,
    positivePhaseDuration,
    arrivalTime
  };
}
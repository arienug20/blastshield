import type { TNOOutput } from '../types';

/**
 * TNO Multi-Energy Method for VCE Blast Analysis
 * Based on van den Berg (1985) and TNO Green Book
 */

// TNO blast curves for different source strengths (1-10)
// Format: [scaled_distance, scaled_overpressure]
const TNO_OVERPRESSURE_CURVES: Record<number, Array<[number, number]>> = {
  1: [[0.5, 0.002], [1.0, 0.0015], [2.0, 0.001], [5.0, 0.0005], [10.0, 0.0002]],
  3: [[0.5, 0.01], [1.0, 0.008], [2.0, 0.005], [5.0, 0.002], [10.0, 0.001]],
  5: [[0.5, 0.05], [1.0, 0.04], [2.0, 0.025], [5.0, 0.01], [10.0, 0.005]],
  7: [[0.5, 0.15], [1.0, 0.12], [2.0, 0.08], [5.0, 0.03], [10.0, 0.015]],
  10: [[0.5, 0.4], [1.0, 0.3], [2.0, 0.2], [5.0, 0.08], [10.0, 0.04]]
};

// TNO impulse curves
const TNO_IMPULSE_CURVES: Record<number, Array<[number, number]>> = {
  1: [[0.5, 0.003], [1.0, 0.0025], [2.0, 0.002], [5.0, 0.001], [10.0, 0.0005]],
  3: [[0.5, 0.015], [1.0, 0.012], [2.0, 0.008], [5.0, 0.0035], [10.0, 0.002]],
  5: [[0.5, 0.04], [1.0, 0.03], [2.0, 0.02], [5.0, 0.008], [10.0, 0.004]],
  7: [[0.5, 0.08], [1.0, 0.06], [2.0, 0.04], [5.0, 0.015], [10.0, 0.008]],
  10: [[0.5, 0.15], [1.0, 0.12], [2.0, 0.08], [5.0, 0.03], [10.0, 0.015]]
};

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

  if (x <= sorted[0][0]) {
    return sorted[0][1];
  }
  if (x >= sorted[sorted.length - 1][0]) {
    const last = sorted[sorted.length - 1];
    const secondLast = sorted[sorted.length - 2];
    const exponent = Math.log(last[1] / secondLast[1]) / Math.log(last[0] / secondLast[0]);
    return last[1] * Math.pow(x / last[0], exponent);
  }

  for (let i = 0; i < sorted.length - 1; i++) {
    if (x >= sorted[i][0] && x <= sorted[i + 1][0]) {
      return interpolate(x, sorted[i][0], sorted[i][1], sorted[i + 1][0], sorted[i + 1][1]);
    }
  }

  return sorted[sorted.length - 1][1];
}

/**
 * Get curve for given source strength (interpolate between available curves)
 */
function getCurveForStrength(sourceStrength: number, curves: Record<number, Array<[number, number]>>): Array<[number, number]> {
  const strengths = Object.keys(curves).map(Number).sort((a, b) => a - b);

  if (sourceStrength <= strengths[0]) {
    return curves[strengths[0]];
  }
  if (sourceStrength >= strengths[strengths.length - 1]) {
    return curves[strengths[strengths.length - 1]];
  }

  // Find surrounding strengths
  for (let i = 0; i < strengths.length - 1; i++) {
    if (sourceStrength >= strengths[i] && sourceStrength <= strengths[i + 1]) {
      const s1 = strengths[i];
      const s2 = strengths[i + 1];
      const curve1 = curves[s1];
      const curve2 = curves[s2];
      const factor = (sourceStrength - s1) / (s2 - s1);

      // Interpolate between curves
      return curve1.map(([x, y1], idx) => {
        const y2 = curve2[idx][1];
        return [x, y1 + factor * (y2 - y1)];
      });
    }
  }

  return curves[strengths[0]];
}

/**
 * Run TNO Multi-Energy Analysis
 */
export function runTNOAnalysis(
  sourceStrength: number,        // 1-10
  cloudVolume: number,            // m³
  standoffDistance: number,       // m
  ambientPressure: number = 1.013 // bar
): TNOOutput {
  // Sachs-scaled distance: Z = R / (V_cloud/10)^(1/3)
  const scaledDistance = standoffDistance / Math.pow(cloudVolume / 10, 1/3);

  // Get curves for source strength
  const overpressureCurve = getCurveForStrength(sourceStrength, TNO_OVERPRESSURE_CURVES);
  const impulseCurve = getCurveForStrength(sourceStrength, TNO_IMPULSE_CURVES);

  // Get scaled values
  const scaledOverpressure = getCurveValue(scaledDistance, overpressureCurve);
  const scaledImpulse = getCurveValue(scaledDistance, impulseCurve);

  // Convert to dimensional values
  // Ps = P̄s × P₀
  const peakOverpressure = scaledOverpressure * ambientPressure; // bar

  // is = Īs × P₀^(2/3) × (V_cloud/10)^(1/3)
  // Using speed of sound for conversion
  const speedOfSound = 340; // m/s
  const positivePhaseImpulse = scaledImpulse * Math.pow(ambientPressure * 100000, 2/3) * Math.pow(cloudVolume / 10, 1/3) / speedOfSound; // Pa·s
  const impulseBarMs = (positivePhaseImpulse / 100000) * 1000;

  // Estimate duration
  const positivePhaseDuration = (2 * impulseBarMs) / peakOverpressure; // ms

  return {
    sourceStrength,
    scaledDistance,
    peakOverpressure,
    positivePhaseImpulse: impulseBarMs,
    positivePhaseDuration
  };
}